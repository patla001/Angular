/*
 * ContentItemType
 * Enum used to describe the type of the item in the directory.
 * The item can be a directory, a file or image (the selected file will have its
 * extension checked), a link, text, or html
 */
export enum ContentItemType {
    DIRECTORY, // New folder icon
    // Add icon
    FILE,
    IMAGE,
    LINK,
    TEXT,
    HTML
}

/*
 * ContentItem
 * The model used to store the data within each node.
 *
 * (title: string) - the name used to describe item
 * (content: any) - the content for this item
 *          DIRECTORY - push id for document under courseId/content collection
 *          FILE/IMAGE - path to firebase storage
 *          LINK - the url (string)
 *          TEXT - the text (?)
 *          HTML - the html (?)
 * (type: ContentItemType) - the type for the item
 */
export interface ContentItem {
    /*==========================================================
                            PROPERTIES
    ==========================================================*/
    title: string;
    content: any;
    type: ContentItemType;
}
