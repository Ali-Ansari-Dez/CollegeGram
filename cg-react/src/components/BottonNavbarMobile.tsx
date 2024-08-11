import add from "../assets/icons/add.svg"
import mag from "../assets/icons/Frame.svg"
import overview from "../assets/icons/overview.svg"

const BottomNavbarMobile: React.FC = () => {
  return (
      <div className="md:hidden bg-khakeshtari-600 fixed bottom-0 flex h-[56px] items-center justify-center rounded-full border border-khakeshtari-400 max-md:w-9/12 ml-14">
        <button className="md:hidden fixed bottom-5 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-okhra-200">
            <img src={add} alt="add" />
        </button>
        <div className="md:hidden flex justify-between space-x-44">
            <img src={mag} alt="magnifier" />
            <img src={overview} alt="overview" />
        </div>
      </div>
  );
};

export default BottomNavbarMobile;
