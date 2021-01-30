import { ContentItem } from '../content/content-item';

/*
 * ContentItemStack
 * Data structure to create and modify the breadcrumb
 * used for traversing the content directory.
 *
 * This stack is modified to always have at least one item in the
 * stack, which is the root. In this case, an "empty" stack is
 * the stack when it is initialized with a length of 1, being the root.
 *
 * Max size is set to 50 levels deep, but realistically faculty
 * members should not be adding folders and files that deep.
 */
export class ContentItemStack {
    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    array: ContentItem[] = [];

    MAX_SIZE: number = 51;

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(rootContent: ContentItem) {
        this.push(rootContent);
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    length(): number {
        return this.array.length;
    }

    getArray(): ContentItem[] {
        return this.array;
    }

    isEmpty(): boolean {
        return (this.array.length == 1) ? true : false;
    }

    push(contentItem: ContentItem): boolean {
        if ((this.array.length + 1) > this.MAX_SIZE) {
            console.log("ContentItemStack: push() - ERROR => Max size reached");
            return false;
        }
        this.array.push(contentItem);
        return true;
    }

    pop(): ContentItem {
        if (this.isEmpty()) {
            console.log("ContentItemStack: pop() - ERROR => Can't pop empty stack");
            return null;
        }
        return this.array.pop();
    }

    popUntil(contentItem: ContentItem): ContentItem {
        if (this.isEmpty()) {
            console.log("ContentItemStack: pushUntil() - ERROR => Can't popUntil empty stack");
            return null;
        }

        // Document id should be in property content
        let contentItemDocId = contentItem.content;
        let lastPoppedItem: ContentItem = null;

        while(contentItemDocId != this.peek().content) {
            lastPoppedItem = this.pop();
        }

        // Should not return null in this case (disable popUntil very top item)
        return lastPoppedItem;
    }

    peek(): ContentItem {
        if (this.length() === 0) {
            console.log("ContentItemStack: peek() - ERROR => Can't peek empty stack");
            return null;
        }
        return this.array[(this.array.length) - 1];
    }
}
