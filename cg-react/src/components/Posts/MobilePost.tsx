import whitePen from "../../assets/icons/whitePen.svg";
import post from "../../assets/Images/post.png";
import redPen from "../../assets/icons/redPen.svg";
import AvatarName from "../AvatarName";
import DesktopCaption from "./DesktopCaption";
import BottomNavbarMobile from "../BottonNavbarMobile";
import { useRecoilValue } from "recoil";
import { userProfileAtom } from "../../user-actions/atoms";
import CustomButton from "../CustomButton";

interface MobilePostProps {
  children?: React.ReactNode;
}

const MobilePost: React.FC<MobilePostProps> = ({ children }) => {
  const userProfile = useRecoilValue(userProfileAtom);
  const avatar = userProfile.avatar;
  const username = userProfile.username;

  return (
    <div className="mx-auto h-[720px] w-[520px]">
      <div
        className="flex items-center justify-between max-md:mt-[52px]"
        dir="rtl"
      >
        <AvatarName
          name={username}
          avatar={avatar}
          className="py-4 pr-1"
        ></AvatarName>
        <CustomButton
          text={"ویرایش پست"}
          iconsrc={whitePen}
          className="ml-1 bg-okhra-200 max-md:hidden"
        ></CustomButton>
        <img src={redPen} alt="edit" className="pl-6 md:hidden" />
      </div>
      <img src={post} alt="post" className="py-2" />
      <DesktopCaption
        date={"2 ماه پیش"}
        caption={
          "ترس یکی از مهمترین عوامل #قدرت است؛ کسی که بتواند در #جامعه سمت و سوی ترس را معین کند #قدرت زیادی بر آن جامعه پیدا می‌کند. شاید بتوان هم صدا با جورجو آگامبنِ فیلسوف گفت که ما امروزه همیشه در یک حالت اضطراری زندگی می‌کنیم "
        }
      ></DesktopCaption>
      {children}
      <BottomNavbarMobile></BottomNavbarMobile>
    </div>
  );
};

export default MobilePost;
