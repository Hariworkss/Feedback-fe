import { TbLogout } from "react-icons/tb";
import { logOut } from '../../components/firebase/firebase';

function Navbar() {
  return (
    <>
      <div className='w-full h-[60px] bg-blue-950 flex justify-between px-6 '>
        <div className='flex justify-between'>
        <img className=' mt-[10px] rounded-[30px] w-[35px] h-[35px] me-2 ' src="/logo-power.svg" alt="" />
        <h4 className='text-[#b2c1cb] mt-3 text-xl font-bold italic'>DSIG Group</h4>
        <h4>Powered by Bz Analytics</h4>
        </div>

        <button
          onClick={logOut}
          className=" text-white border flex h-[40px]  justify-center items-center gap-2 rounded-md mt-2 px-2 py-2  shadow-lg hover:scale-105 duration-150"
        >
         <p>Logout</p> 
          <TbLogout />
        </button>

      </div>
    </>
  )
}

export default Navbar
