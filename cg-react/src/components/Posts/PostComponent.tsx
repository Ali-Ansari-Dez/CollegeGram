import whitePen from "../../assets/icons/whitePen.svg";
import redPen from "../../assets/icons/redPen.svg";
import AvatarName from "../AvatarName";
import DesktopCaption from "./DesktopCaption";
import BottomNavbarMobile from "../BottonNavbarMobile";
import { userProfileAtom } from "../../user-actions/atoms";

import CommentSection from "./comment/CommentSection";
import mockData from "./mockCommentData.json";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useLocation } from "react-router-dom";
import {
  QueryClient,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { FetchComments } from "./comment/FetchComments";
import { BeatLoader } from "react-spinners";
import { useInView } from "react-intersection-observer";
import timeTranslate from "../../utilities/timeTranslationFunction";
import CustomButton from "../CustomButton";
import PostInteractions from "./PostInteractions";
import ModalTemplate from "../ModalTemplate";
import EditPostsModal from "../upload-edit-posts/EditPostModal";

interface PostsPageProps {
  children?: React.ReactNode;
}

interface Media {
  id: string;
  mime: string;
  name: string;
  url: string;
  size: number;
  children?: React.ReactNode;
}

const PostComponent = (props: PostsPageProps) => {
  const { children } = props;

  const userProfile = useRecoilValue(userProfileAtom);
  const { ref, inView } = useInView();

  const location = useLocation();
  const data = location.state?.post;
  const id = location.state?.postId || "defaultId";


  const commentingProps = {
    avatar: userProfile.avatar,
    id: id,
  };

  const avatar = userProfile.avatar;
  const username = userProfile.username;

  const [token, setToken] = useState<string | null>(null);

  const [editPostModal, setEditPostModal] = useState(false);

  const handleEditPostClick = () => {
    setEditPostModal(true);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || " ");
  }, []);

  const {
    data: commentData,
    fetchNextPage: fetchNextPageComment,
    hasNextPage: hasNextPageComment,
    isFetching: isFetchingComment,
    isLoading: isLoadingCommnet,
    isError: isErrorComment,
    error: commentError,
  } = useInfiniteQuery({
    queryKey: ["comments", token],
    queryFn: async ({ pageParam = 1 }) =>
      FetchComments({ pageParam }, token || "", id),
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage ?? undefined;
    },
    initialPageParam: 1,
    enabled: !!token && !!userProfile.username,
  });

  useEffect(() => {
    if (inView && hasNextPageComment) {
      fetchNextPageComment();
    }
  }, [inView, hasNextPageComment, fetchNextPageComment]);

  const postInteractionProps = data?.data
    ? {
        likes: data.data.likesCount ?? 0,
        comments: data.data.commentsCount ?? 0,
        bookmarks: data.data.bookmarksCount ?? 0,
        id: data.data.id ?? "",
        isLiked: data.data.isLiked ?? false,
        isBookmarked: data.data.isBookmarked ?? false,
      }
    : {
        likes: 0,
        comments: 0,
        bookmarks: 0,
        id: "",
        isLiked: false,
        isBookmarked: false,
      };

  return (
    <div className="mx-auto mt-4 max-md:h-full max-md:w-full max-sm:overflow-y-auto" dir="rtl">
      <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
        <div className="w-[520px] max-sm:w-[100%]">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation={{ enabled: data.data && data.data.media.length > 0 }}
            pagination={{ clickable: true }}
            className="md:w-full"
            style={{ zIndex: 0 }}
            modules={[Navigation]}
          >
            {data &&
              data.data.media.map((post: Media) => (
                <SwiperSlide key={post.id}>
                  <img
                    src={`${post.url}`}
                    className="h-[400px] w-[520px] rounded-3xl object-cover max-sm:h-[375px] max-sm:w-[100%] max-sm:px-2"
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <div className="h-[680px] overflow-auto pl-8 max-sm:pl-2">
          <div className="flex items-center justify-between max-md:mt-0">
            <AvatarName
              name={data.data.author.username}
              avatar={data.data.author.avatar.url}
              className="py-4 pr-1"
            ></AvatarName>
            {userProfile?.username === data?.data.author.username && (
              <>
                <CustomButton
                  text={"ویرایش پست"}
                  iconsrc={whitePen}
                  className="ml-1 bg-red-200 max-md:hidden"
                  handleOnClick={handleEditPostClick}
                ></CustomButton>
                <img src={redPen} alt="edit" className="pl-6 md:hidden" />
              </>
            )}
          </div>
          <DesktopCaption
            date={timeTranslate(data.data.createdAt)}
            caption={data.data.caption}
            mentions={data.data.mentions}
          />
          <div className="flex justify-end">
            <PostInteractions {...postInteractionProps} />
          </div>
          {children}
          {commentData && (
            <CommentSection
              id={id}
              showProps={commentData.pages[0].data.comments}
              commentingProps={commentingProps}
            ></CommentSection>
          )}

          <div className="flex justify-center" ref={ref}>
            {isFetchingComment && <BeatLoader />}
          </div>
          {/* <BottomNavbarMobile></BottomNavbarMobile> */}
        </div>
      </div>

      {editPostModal && (
        <ModalTemplate
          showModal={editPostModal}
          onClose={() => setEditPostModal(false)}
        >
          {" "}
          <EditPostsModal
            onClose={() => setEditPostModal(false)}
            postData={data.data}
            postId={id}
          />
        </ModalTemplate>
      )}
    </div>
  );
};

export default PostComponent;
