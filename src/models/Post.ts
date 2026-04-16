/**
 * @interface Post
 * @description The standard data model for a post across web and mobile platforms.
 */

export interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
}
