import { Post, PostProps } from './Post';

describe('Post', () => {
  const initialPostData: PostProps = {
    authorId: '1',
    text: 'Some nice content!',
    images: [],
    createdAt: new Date(),
  };
  it('should create a post', () => {
    const post = Post.create(initialPostData);

    expect(post.authorId).toEqual(initialPostData.authorId);
    expect(post.text).toEqual(initialPostData.text);
    expect(post.images).toEqual(initialPostData.images);
    expect(post.createdAt).toEqual(expect.any(Date));
  });

  it('should set updatedAt when updating post data', () => {
    const post = Post.create(initialPostData);

    const newPostData: Partial<PostProps> = {
      text: 'New content!',
    };

    post.updateText(newPostData);

    expect(post.text).toEqual(newPostData.text);
    expect(post.updatedAt).toBeTruthy();
  });
});
