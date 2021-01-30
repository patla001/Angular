import { Node } from './node';
import { ContentItem, ContentItemType } from './content-item';
import { ContentItemStack } from '../breadcrumb/content-item-stack';

/*
 * GeneralTree
 * The tree making up the core data structure used to display the
 * content directory and all of its items. Uses the Node class in order
 * to hold the ContentItem data and access other children of type ContentItem.
 *
 * This tree only requires references to the current node and the root node.
 * Each click on a sub-directory allows for traversal down the tree which changes
 * the current node reference, essentially by setting the current node to a new node
 * with empty children, and populating the children. Traversal up works in a similar
 * manner.
 *
 * The tree also manages a breadcrumb, which is a stack of ContentItem.
 */
export class GeneralTree {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    root: Node;
    currentNode: Node;

    CONTENT_ROOT_REF: string = "root";

    contentItemStack: ContentItemStack;

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor() {
        // Initialize root with empty directory
        let rootData: ContentItem = {
            title: this.CONTENT_ROOT_REF,
            content: this.CONTENT_ROOT_REF,
            type: ContentItemType.DIRECTORY
        };
        this.root = new Node(rootData, []);
        this.currentNode = this.root;

        // Initialize stack with root
        this.contentItemStack = new ContentItemStack(rootData);
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    // Get current node's data
    getData(): ContentItem {
        return this.currentNode.getData();
    }

    // Get current node's children
    getChildren(): ContentItem[] {
        return this.currentNode.getChildren();
    }

    // Set current node's children
    setChildren(children: ContentItem[]) {
        this.currentNode.setChildren(children);
    }

    // Get current node's children length
    length(): number {
        return this.currentNode.length();
    }

    // Get the root node
    getRootNode(): Node {
        return this.root;
    }

    // Get the current node
    getCurrentNode(): Node {
        return this.currentNode;
    }

    // Set the current node [NOT USING]
    setCurrentNode(data: ContentItem, children: ContentItem[]) {
        this.currentNode.setNode(data, children);
    }

    /*
     * When user decides to add folder, file, link, text, or html,
     * a new object following structure of ContentItem will be added and
     * appended as a child to the currentNode
     */
    insertNewChild(title: string, content: any, type: ContentItemType) {
        let data = {
            title: title,
            content: content,
            type: type
        };
        this.currentNode.insertNewChild(data);
    }

    /*---------------------------------------------------------
                            Tree Traversal
    ----------------------------------------------------------*/
    traverseDownTree(currentNodeContentItem: ContentItem): boolean {

        if (!this.contentItemStack.push(currentNodeContentItem)) {
            console.log("traverseDownTree() - ERROR => Can't traverse down tree");
            return false;
        }

        // Overwrite current node with a new node, empty children (until
        // GET request from firestore populates it)
        this.currentNode = new Node(currentNodeContentItem, []);
        return true;
    }

    traverseUpTree(untilContent?: ContentItem): boolean {

        if (untilContent) {
            // Pop the content until reached the specified node
            let poppedContent = this.contentItemStack.popUntil(untilContent);
            if (poppedContent == null) {
                console.log("traverseUpTree() - ERROR => Can't traverse up tree until");
                return false;
            }

        } else {
            // Pop the content for the current node from stack
            let poppedContent = this.contentItemStack.pop();
            if (poppedContent == null) {
                console.log("traverseUpTree() - ERROR => Can't traverse up tree");
                return false;
            }
        }

        // Peek to get the content for the content node
        let peekedContent = this.contentItemStack.peek();
        if (peekedContent == null) {
            console.log("traverseUpTree() - ERROR => Can't peek content");
            return false;
        }

        // Overwrite current node with a new node, empty children (until
        // GET request from firestore populates it)
        this.currentNode = new Node(peekedContent, []);
        return true;
    }

    /*---------------------------------------------------------
                            Breadcrumb
    ----------------------------------------------------------*/
    getBreadcrumb(): ContentItem[] {
        return this.contentItemStack.getArray();
    }

    lengthStack(): number {
        return this.contentItemStack.length();
    }
}
