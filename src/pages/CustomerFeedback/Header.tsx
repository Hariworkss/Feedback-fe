
function Header() {
  return (
    <>
      <section className="bg-[#eeeff0] pt-[80px] pb-[120px]">
        <div className="w-full flex justify-center">
        <div className="w-[30%] flex justify-between">
        <img className='rounded-[10px] w-[200px] ms-2 ' src="/chambers.png" alt="" />
        <img className='rounded-[10px] w-[200px] ms-2 ' src="/dsig.png" alt="" />


        </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-1">
            <div className='pt-[60px]'>
              <h1 className="text-4xl font-bold leading-tight md:text-4xl text-center text-[#0c0c31]">AI FOR ALL <br />EMPOWERING RESPONSIBLE INVESTMENTS
              </h1>
              <p className="mt-[20px] mb-[-30px] text-xl text-muted-foreground text-center">
              THURSDAY, 29TH AUGUST 2024 <br /> 9 A.M. - 1 P.M.              </p>
              <p className="mt-[30px] mb-[-30px] text-[19px] text-muted-foreground text-center">13th floor, Conference Room - Dubai Chambers, Baniyas Road, Port Saeed; Dubai</p>
            </div>
            {/* <div className="flex items-center justify-center">
                    <img className='rounded-[100px] w-[80%] ' src="/hero.jpg" alt="" />
            </div> */}
          </div>
        </div>
      </section>
    </>
  )
}

export default Header
