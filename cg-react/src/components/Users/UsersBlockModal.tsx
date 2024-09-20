import { useEffect, useState } from "react";
import CustomButton from "../CustomButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { BlockAUser } from "../profile-page/Blocking/BlockAUser";
import BlockingModal from "../profile-page/Blocking/BlockingModal";

interface UsersBlockModalProps {
  username: string;
  avatar: string;
  followersCount: number;
  userId: string | null;
  token: string | null;
  onClick: () => void;
}

const UsersBlockModal = ({
  username,
  avatar,
  followersCount,
  userId,
  token,
  onClick,
}: UsersBlockModalProps) => {
  // const [blockModal, setBlockModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: blockData,
    isError: blockError,
    isFetching: blockFetching,
    refetch: blockRefetch,
    isSuccess: blockisSuccess,
  } = useQuery({
    queryKey: ["blockUser", userId],
    queryFn: () => BlockAUser(token || "", userId as string),
    enabled: false,
  });

  const handleBlockAUser = async () => {
    try {
      await blockRefetch();
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["othersProfile", username],
      })
      onClick();
    }
  };

  return (
    <div dir="rtl">
      <BlockingModal
        name={username}
        avatar={avatar}
        followersCount={followersCount}
      ></BlockingModal>
      <div className="mt-8 flex flex-row self-end">
        <CustomButton
          text="پشیمون شدم"
          className="ml-4 !text-black-100"
          handleOnClick={() => onClick()}
        ></CustomButton>
        <CustomButton
          text="آره حتما"
          className="bg-red-200"
          handleOnClick={handleBlockAUser}
        >
          {blockFetching && <ClipLoader color="#9b9b9b" size={20} />}
        </CustomButton>
      </div>
    </div>
  );
};

export default UsersBlockModal;
