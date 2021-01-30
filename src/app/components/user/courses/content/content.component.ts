import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { GeneralTree } from '../../../../model/content/general-tree';
import { Node } from '../../../../model/content/node';
import { ContentItem, ContentItemType } from '../../../../model/content/content-item';


/*
 * Content
 * Displays the directory of content that the faculty of the course
 * uploaded. Only faculty members can add and delete files, manipulating
 * the tree. Students will only be able to view. This component hosts both
 * the content tree as well as the breadcrumb which keeps track of the
 * current path of the tree (implemented by a stack).
 */
@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    contentGeneralTree: GeneralTree = new GeneralTree();
    currentNodeChildren$: Observable<any>;
    subscriptions: Subscription = new Subscription();

    // File Uploading
    uploadPercent: string = "";
    uploadPercent$: Observable<number>;
    downloadUrl$: Observable<string>;

    contentItemType = ContentItemType;

    // Popup and Input
    isInputTextPopupVisible: boolean = false;
    inputTextTitle: string = "Add folder";
    isContentTabBarPopupVisible: boolean = false;

    // Content Item Actions (Single and Double Clicks)
    highlightedItemIndex: number;
    preventSingleClick = false;
    timer: any;
    delay: number = 200;

    gettingChildren: boolean = false;
    indeterminateProgressBarTitle: string = "";

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(
        private afs: AngularFirestore,
        private storage: AngularFireStorage
    ) { }

    ngOnInit() {
        let rootDocumentId = this.contentGeneralTree.getData().content;
        this.getCurrentNodeChildren(rootDocumentId);
    }

    ngOnDestroy() {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    // Return the number of children of current node
    length(): number {
        return this.contentGeneralTree.length();
    }

    // Return the children of current node
    getChildren(): ContentItem[] {
        return this.contentGeneralTree.getChildren();
    }

    // Return the root node
    getRootNode(): Node {
        return this.contentGeneralTree.getRootNode();
    }

    // Return the current node
    getCurrentNode(): Node {
        return this.contentGeneralTree.getCurrentNode();
    }

    // Insert a new child into the current node
    insertNewChild(title: string, content: any, type: ContentItemType) {
        this.contentGeneralTree.insertNewChild(title, content, type);
    }

    /*---------------------------------------------------------
                            Firestore
    ----------------------------------------------------------*/
    setCurrentNodeChildren(documentId: string) {
        // Get reference to document of current node
        let currentNodeDoc: AngularFirestoreDocument<any> =
            this.afs.doc<any>('University of California, Santa Barbara/courses/2019 Fall/courseId/content/' + documentId);

        // Convert to array of objects
        // let childrenObjectArray = currentNodeChildren.map((obj) => {
        //     return Object.assign({}, obj);
        // });

        // Add key children for array of objects
        let childrenObjectArrayWithKey = {
            children: JSON.stringify(this.getChildren())
        }

        console.log(childrenObjectArrayWithKey);
        currentNodeDoc.set(childrenObjectArrayWithKey)
            .then(() => {
                this.getCurrentNodeChildren(documentId);
            })
            .catch((error)=> {
                console.log("There was an error setting the object", error);
            });
    }

    getCurrentNodeChildren(documentId: string) {
        console.log("getCurrentNodeChildren() - documentId = " + documentId);

        this.gettingChildren = true;

        // Grab children from firebase based on document id
        let currentNodeDoc: AngularFirestoreDocument<any> =
            this.afs.doc<any>('University of California, Santa Barbara/courses/2019 Fall/courseId/content/' + documentId);

        this.currentNodeChildren$ = undefined;
        this.currentNodeChildren$ = currentNodeDoc.valueChanges();
        this.subscriptions.add(
            this.currentNodeChildren$.subscribe((childrenObjectArrayWithKey: any) => {

                if (childrenObjectArrayWithKey == null) {
                    console.log("Document doesn't exist");
                    this.gettingChildren = false;
                    return;
                }

                if (!childrenObjectArrayWithKey.children) {
                    console.log("Key 'children' doesn't exist");
                    this.gettingChildren = false;
                    return;
                }

                // Get the array of objects from the key
                let childrenObjectArray = childrenObjectArrayWithKey.children;

                // Parse the value, in this case the childrenObjectArray
                let children: ContentItem[] = JSON.parse(childrenObjectArray);

                // Set the children of the current node
                this.contentGeneralTree.setChildren(children);
                this.gettingChildren = false;
            })
        );
    }

    //** For New Folders **//
    setNewContentDocument(folderTitle: string) {
        let contentCollection = this.afs.collection<any>('University of California, Santa Barbara/courses/2019 Fall/courseId/content');

        // Add doc with generated id to collection, and save id to the new child's content
        // property of the current node
        contentCollection.add({})
            .then((documentReference: DocumentReference) => {
                let documentId = documentReference.id;
                this.insertNewChild(folderTitle, documentId, ContentItemType.DIRECTORY);
                this.setCurrentNodeChildren(this.contentGeneralTree.getData().content);
            })
            .catch((error) => {
                console.log("Error adding new document to firestore", error);
            });
    }

    //** For New Files **//
    uploadFileToCloudStorage(file: any) {

        // Make progress bar visible
        // this.setProgressBarVisible(true);

        // Prepare path to cloud storage and upload file
        // TODO - Return content path '...' + contentGeneralTree.getContentPath() + '...'
        // getContentPath() should build the path based on the constructed breadcrumb, and
        // this path is appended to '.../content/'
        const filePath = 'University of California, Santa Barbara/courses/2019 Fall/courseId/content/' + file.name;
        const ref = this.storage.ref(filePath);
        const task = ref.put(file);

        // Observe percentage changes
        this.uploadPercent$ = task.percentageChanges();

        this.subscriptions.add(
            this.uploadPercent$.subscribe((value: number) => {
                this.uploadPercent = value.toString() + "%";
                console.log("Upload Percent:" + this.uploadPercent);
            })
        );

        // Get notified when download url is available
        this.subscriptions.add(
            task.snapshotChanges().pipe(
                finalize(() => {
                    this.downloadUrl$ = ref.getDownloadURL();

                    // this.setProgressBarVisible(false);

                    // Insert new child into the tree, then update children on firestore
                    // Second parameter should be file path to firestore
                    // '...' + contentGeneralTree.getContentPath() + '...'
                    this.insertNewChild(file.name, filePath, ContentItemType.FILE);
                    this.setCurrentNodeChildren(this.contentGeneralTree.getData().content);
                })
            ).subscribe()
        );
    }

    /*---------------------------------------------------------
                            Content Item Actions
    ----------------------------------------------------------*/
    onSingleClick(event: any, index: number) {
        console.log("onSingleClick()");

        this.timer = setTimeout(() => {
            if (!this.preventSingleClick) {
                // Do single click action
                this.setHighlightedItemIndex(index);

                console.log("Item's type = " + this.getChildren()[index].type);
            }
            this.preventSingleClick = false;
        }, this.delay);
    }

    onDoubleClick(event: any, index: number) {
        console.log("onDoubleClick()");

        clearTimeout(this.timer);
        this.preventSingleClick = true;

        // Do double click action
        this.setHighlightedItemIndex(index);
        this.openContentItem(index);
    }

    setHighlightedItemIndex(index: number) {
        console.log("setHighlightedItemIndex() - index = " + index);

        this.highlightedItemIndex = index;
    }

    clearHighlightedItemIndex() {
        this.highlightedItemIndex = null;
    }

    openContentItem(index: number) {
        console.log("openContentItem() - index = " + index);

        // Get the Content Item using the index parameter
        let currentNodeChildren: ContentItem[] = this.getChildren();
        let contentItem = currentNodeChildren[index];

        // If content item is a file, open file in new tab and allow download
        // If content item is an image, open image in preview and allow download
        // If content item is text, open text...?? (preview or new tab)
        // If content item is html, open html...?? (embed or new tab)

        // TEMP: Output Content type
        switch (contentItem.type) {
            // If content item is a directory, traverse down the tree
            case this.contentItemType.DIRECTORY: {
                console.log("Type is DIRECTORY");

                if (!this.contentGeneralTree.traverseDownTree(contentItem)) {
                    console.log("ERROR => Can't traverse down tree");
                    return;
                }

                // Clear highlighted item
                this.clearHighlightedItemIndex();

                // Get document id for firestore (should be saved in content)
                // and get children content items
                let documentId = this.getCurrentNode().getData().content;
                this.getCurrentNodeChildren(documentId);
                break;
            }
            case this.contentItemType.FILE: {
                console.log("Type is FILE");
                break;
            }
            case this.contentItemType.IMAGE: {
                console.log("Type is IMAGE");
                break;
            }
            // If content item is a link, open link in new tab
            case this.contentItemType.LINK: {
                console.log("Type is LINK");

                window.open(contentItem.content);
                break;
            }
            case this.contentItemType.TEXT: {
                console.log("Type is TEXT");
                break;
            }
            case this.contentItemType.HTML: {
                console.log("Type is HTML");
                break;
            }
        }
    }

    /*---------------------------------------------------------
                            Content Toolbar
    ----------------------------------------------------------*/
    onBackClick() {
        console.log("onBackClick()");

        // Traverse back up the tree
        if (!this.contentGeneralTree.traverseUpTree()) {
            console.log("ERROR => Can't traverse up tree");
            return;
        }

        // Clear highlighted item
        this.clearHighlightedItemIndex();

        // Get document id and get children content items
        let documentId = this.getCurrentNode().getData().content;
        this.getCurrentNodeChildren(documentId);
    }

    onBreadcrumbItemClick(contentItem: ContentItem) {
        console.log("onBreadcrumbItemClick() - content item title: " + contentItem.title);

        // Traverse back up the tree until reached specified content item
        if (!this.contentGeneralTree.traverseUpTree(contentItem)) {
            console.log("ERROR => Can't traverse up tree");
            return;
        }

        // Clear highlighted item
        this.clearHighlightedItemIndex();

        // Get document id and get children content items
        let documentId = this.getCurrentNode().getData().content;
        this.getCurrentNodeChildren(documentId);
    }

    // index will return zero-based index in terms of the breadcrumb links,
    // including the root. stackLength() returns the length of the stack including root
    isLastBreadcrumb(index: number): boolean {
        return ( (this.contentGeneralTree.lengthStack() - 1) == index);
    }

    getBreadcrumb(): ContentItem[] {
        return this.contentGeneralTree.getBreadcrumb();
    }

    /*---------------------------------------------------------
                            Popup
    ----------------------------------------------------------*/
    setInputTextPopupVisible(value: boolean) {
        this.isInputTextPopupVisible = value;
    }
    setContentTabBarPopupVisible(value: boolean) {
        this.isContentTabBarPopupVisible = value;
    }

    /*==========================================================
                            OUTPUT
    ==========================================================*/
    onInputTextOutput(folderTitle: string) {
        console.log("onInputTextOutput() - new folder name: " + folderTitle);

        this.setInputTextPopupVisible(false);

        this.setNewContentDocument(folderTitle);
    }

    onAddFileOutput(file: any) {
        console.log("onAddFileOutput() - new file name: " + file.name);
        console.log("File: " + file);

        this.setContentTabBarPopupVisible(false);

        this.uploadFileToCloudStorage(file);
    }
    onAddLinkOutput(linkOutput: string[]) {
        console.log("onAddLinkOutput() - new link name: " + linkOutput[0]);
        console.log("Link: " + linkOutput[1]);

        this.setContentTabBarPopupVisible(false);

        // Insert new child into the tree, then update children on firestore
        this.insertNewChild(linkOutput[0], linkOutput[1], ContentItemType.LINK);
        this.setCurrentNodeChildren(this.contentGeneralTree.getData().content);
    }

    onAddTextOutput(text: string) {
        console.log("onAddTextOutput() - new text: " + text);

        this.setContentTabBarPopupVisible(false);
    }
    onAddHtmlOutput(html: string) {
        console.log("onAddHtmlOutput() - new html: " + html);

        this.setContentTabBarPopupVisible(false);
    }
}
