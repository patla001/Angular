import { ContentItem } from './content-item';

/*
 * Node
 * The node that holds the data as well as the data of its
 * children. Property data will always be the properties of a
 * ContentItem of type folder. Thus, each node is utlimately
 * a folder that contains children of type ContentItem.
 */
export class Node {

    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    data: ContentItem;
    children: ContentItem[];

    /*==========================================================
                            LIFECYCLE
    ==========================================================*/
    constructor(data: ContentItem, children: ContentItem[]) {
        this.data = data;
        this.children = children;
        this.sortChildren();
    }

    /*==========================================================
                            METHODS
    ==========================================================*/
    getData(): ContentItem {
        return this.data;
    }
    setData(data: ContentItem) {
        this.data = data;
    }

    getChildren(): ContentItem[] {
        return this.children;
    }
    setChildren(children: ContentItem[]) {
        this.children = children;
        this.sortChildren();
    }

    setNode(data: ContentItem, children: ContentItem[]) {
        this.data = data;
        this.children = children;
        this.sortChildren();
    }

    length(): number {
        return this.children.length;
    }

    insertNewChild(child: ContentItem) {
        this.children.push(child);
    }

    deleteChild(index: number) {

    }

    private sortChildren() {
        // Sort by type first
        this.children = this.children.sort((o1, o2) => {
            if (o1.type < o2.type) {
                return -1;
            }
            else if (o1.type > o2.type) {
                return 1;
            }
            else {
                // Types are same, so sort alphabetically
                let title1 = o1.title.toLowerCase();
                let title2 = o2.title.toLowerCase();
                if (title1 < title2) {
                    return -1;
                }
                else if (title1 > title2) {
                    return 1
                }
                return 0;
            }
        });
    }
}
