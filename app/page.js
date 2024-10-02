"use client"
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Nav from "./components/Nav";
import Catagorys from "./components/Catagorys";
import BestSellerRibbon from "./components/Bestsellar";
import Typewriter from 'typewriter-effect';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import Footer, { Footercomponent } from "./components/Footer";
import { useRouter } from "next/navigation";
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { date } from "zod";
import { Loader2 } from "lucide-react";
import { Modal } from "flowbite-react";
import Link from "next/link";





export default function Home() {
  const [totalProducts, setTotalProducts] = useState([]);
  const [categorys, setcategorys] = useState([])
  const [currentScroll, setCurrentScroll] = useState("");
  const [cart, setcart] = useState([])
  const [emptycart, setemptycart] = useState(true)
  const [totalprice, settotalprice] = useState(0)
  const [showCart, setshowCart] = useState(false)
  const [currentcategory, setcurrentcategory] = useState("all")
  const [issubmitting, setissubmitting] = useState(false)
  const [isofftime, setisofftime] = useState(false)

  //gpt
  const [showModal, setShowModal] = useState(false);
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState(null);
  const availablePincodes = ['110001', '110002', '110003', '110004']; // Example data, replace with actual API call if needed

  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if ((currentHour === 20 && currentMinute >= 30) ||
        (currentHour >= 22) ||
        (currentHour < 6)) {
        setisofftime(true);
        alert("Our delivery timing is from 6 AM to 9:30 PM. You can now pre order food for leater time.");
      }

      setShowModal(true);
    }, 4000); // 4-second delay
    return () => clearTimeout(timer);
  }, []);
  const handlePincodeSubmit = async () => {
    const loaderToastId = toast({
      title: (
        <div className="flex items-center">
          <Loader2
            size={24}
            color="#000000"
            className="mr-2 animate-spin"
          />
          Checking Avilablity in your location
        </div>
      ),
      description: "Please wait...",
      className: "bg-white text-black",
      duration: null,
    });
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError('Pincode must be a 6-digit number');
      return;
    }

    const res = await fetch(`/api/checkpincode`, {
      method: 'POST',
      body: JSON.stringify({ pincode }),
    });
    const data = await res.json();

    if (data.success) {
      toast({
        title: "Success",
        description: "Service is available in your location",
        variant: "success",
        className: "bg-white text-black",
      });
      setShowModal(false);
      setError(null);
    }
    else {
      toast({
        title: "Error",
        description: "We are not available in your location",
        variant: "destructive",
        className: "bg-white text-black",
      });

      setError('Service is not available in your location.');
    }
  };


  const { toast } = useToast();
  const router = useRouter();


  const handlepayment = async () => {

    try {

      const loaderToastId = toast({
        title: (
          <div className="flex items-center">
            <Loader2
              size={24}
              color="#000000"
              className="mr-2 animate-spin"
            />
            Processing Payment
          </div>
        ),
        description: "Please wait...",
        className: "bg-white text-black",
        duration: null,
      });

      setissubmitting(true);
      const data = await fetch("/api/makeorder", {
        method: "POST",
        body: JSON.stringify({
          product: cart,
          price: totalprice,
        }),
      });
      const response = await data.json();

      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
          className: "bg-white text-black",
        });
      } else {

        toast({
          title: "Order Successful",
          description: "Redirecting to order details...",
          variant: "success",
          className: "bg-white text-black",
        });
        router.push("/orderdetails/" + response.data);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Network Error",
        description: "Please try again later.",
        variant: "destructive",
        className: "bg-white text-black",
      });
    } finally {
      setissubmitting(false);
    }
  };




  const getcategory = useCallback(async () => {
    try {
      const data = await fetch("/api/getcategorys", {
        method: "POST",
      });
      const response = await data.json();
      if (!response.success) {
        setcategorys([]);
        toast({
          title: "Error",
          message: response.message,
          type: "error",
        });
      } else {
        const res = response.data
        setcategorys(res);
      }
    } catch (error) {
      setcategorys([]);
      toast({
        title: "Error",
        message: "Failed to fetch categorys",
        type: "error",
      });
    }
  }, []);


  const getProduct = useCallback(async () => {
    try {
      const data = await fetch("/api/getProducts", {
        method: "POST",
        body: JSON.stringify({
          category: currentcategory,
        })
      });
      const response = await data.json();
      if (!response.success) {
        setTotalProducts([]);
        toast({
          title: "Error",
          message: response.message,
          type: "error",
        });
      } else {
        const arr = response.products
        setTotalProducts(arr);
      }
    } catch (error) {
      setTotalProducts([]);
      toast({
        title: "Error",
        message: "Failed to fetch products",
        type: "error",
      });
    }
  }, [currentcategory]);

  useEffect(() => {
    getProduct();
    getcategory();
  }, [getProduct, currentcategory]);



  const addtocart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);

    if (existingItem) {
      const updatedCart = cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setcart(updatedCart);
    } else {
      const itemWithQuantity = { ...item, quantity: 1 };
      const arr = [...cart, itemWithQuantity]
      setcart(arr);
    }
    setemptycart(false);
    settotalprice(totalprice + item.price);
    toast({
      title: "Added to cart",
      message: "Item added to cart",
      type: "success",
    });
  };

  const removefromcart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);

    if (existingItem && existingItem.quantity > 1) {
      const updatedCart = cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      setcart(updatedCart);
      if (updatedCart.length === 0) {
        setemptycart(true);
      }
    } else if (existingItem) {
      const updatedCart = cart.filter(cartItem => cartItem._id !== item._id);
      setcart(updatedCart);
      if (updatedCart.length === 0) {
        setemptycart(true);
      }
    }

    settotalprice(totalprice - item.price);
  };





  const deleteitemfromcart = (item) => {

    const itemIndex = cart.findIndex((cartItem) => cartItem === item);
    if (itemIndex !== -1) {
      const arr = [...cart];
      arr.splice(itemIndex, 1);
      setcart(arr);
      settotalprice(totalprice - item.price * item.quantity);
      if (arr.length === 0) {
        setemptycart(true);
      }
    }
  };

  const handlechangecat = (cat) => {
    const catname = cat.name
    setcurrentcategory(catname)
  }


  return (
    <>
      <Nav />
      {/* chat gpt */}
      <div >

        {/* Modal Popup */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4">Enter Your Pincode for checking avilablity in your location</h2>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit pincode"
                maxLength="6"
                className="border border-gray-300 p-2 rounded-md w-full mb-4"
              />
              {error && <p className="text-red-500">{error}</p>}
              <button
                onClick={handlePincodeSubmit}
                className="bg-green-600 text-white font-bold p-2 rounded-md w-full"
              >
                Submit Pincode
              </button>
            </div>
          </div>
        )}
      </div>
      {/* chat gpt */}
      {/* <div className="mainitemslogo h-fit p-4 text-3xl mt-4 font-bold text-center">
        <span className="text-green-800">Eat {" "}</span>
        <span className="w-24 inline-block text-start">
          <Typewriter
            options={{
              strings: ['Healthy', 'Anytime', 'Anywhere'],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </div> */}
      {/* <div className="flex mx-auto gap-4 justify-center items-center">
        <Separator className="w-36 bg-gray-400" />
        <img width={30} src="/homepage/schouti.svg" alt="" />
        <Separator className="w-36 bg-gray-400" />
      </div> */}
      {/* <div className="crausel h-36 mt-4 flex items-center justify-center">
        <Carousel className="w-full  h-full max-w-xs">
          <CarouselContent>
            {["/slidebar/Screenshot 2024-09-09 180741.png","slidebar/download (2).jpeg","slidebar/download (1).jpeg","slidebar/download (3).jpeg","slidebar/download (4).jpeg"].map((e, index) => (
              <CarouselItem className="h-full rounded-[30px]" key={index}>
                <div className="rounded-[30px]">
                  <Card className = "rounded-[30px]">
                    <CardContent className="flex rounded-[30px] h-36 p-0 items-center justify-center ">
                      <img className="w-full rounded-[30px] h-full" src={e} alt="" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div> */}
      <div className={`bg-green-700 h-[8.50rem] relative top-[-93px] pt-6 pb-6 mt-8 mb-2 rounded-t-[35px] ${showModal && "blureffect"}`}>
        <div className="flex justify-around overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div onClick={() => { handlechangecat({ name: "all" }) }} className={`flex z-10 flex-col w-[100px] mx-3 p-3  relative  rounded-[3rem] pb-5 ml-4  items-center justify-center ransition-all duration-[2000s] ease-out ${currentcategory === "all" ? "rounded-b-none bg-white " : ""}  `}>
            <div className="bg-yellow-400 w-[60px] h-[74px] flex justify-center items-center rounded-[60px]">
              <img
                src="/Meals.svg"
                alt={"cat.name"}
                className=" z-10 rounded-[4rem] "
              />
            </div>
            <div className={`${currentcategory === "all" ? "text-black" : "text-white"} text-xs z-10 font-bold w-[54px] overflow-x-hidden scrollbar-hide mt-1 h-fit text-center`}>{"All"}</div>
            <img className={`${currentcategory === "all" ? "absolute" : "hidden"} w-[107px] left-[-49px] bottom-[-22px] z-0`} src="/a.svg" alt="" />
            <img className={` ${currentcategory === "all" ? "absolute" : "hidden"} rotate  w-[107px] left-[53px] bottom-[-25px] z-0`} src="/a.svg" alt="" />
          </div>
          {categorys.map((cat, i) => (
            <div onClick={() => { handlechangecat(cat) }} key={i} className={`flex z-10 flex-col w-[100px] mx-3 p-3   relative  rounded-[3rem] pb-5  items-center justify-center transition-all duration-[2000s] ease-out ${currentcategory === cat.name ? "rounded-b-none bg-white" : ""}  `}>
              <div className="bg-yellow-400 w-[60px] h-[74px] flex justify-center items-center rounded-[60px]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className=" z-10 rounded-[4rem] object-cover"
                />
              </div>
              <div className={`${currentcategory === cat.name ? "text-black" : "text-white"} text-xs z-10 font-bold w-[54px] h-[18px] scrollbar-hide overflow-x-auto  mt-1  text-center`}>{cat.name}</div>
              <img className={`${currentcategory === cat.name ? "absolute" : "hidden"} w-[107px] left-[-49px] bottom-[-22px] z-0`} src="/a.svg" alt="" />
              <img className={` ${currentcategory === cat.name ? "absolute" : "hidden"} rotate  w-[107px] left-[53px] bottom-[-25px] z-0`} src="/a.svg" alt="" />
            </div>
          ))}
        </div>
      </div>
      {/* <div className="w-full my-4">
        <div className="text-center my-4 text-3xl text-green-700 font-bold">Categorys</div>
        <div className="overflow-hidden w-full">
          <div className="flex space-x-4 overflow-x-scroll scrollbar-hide p-4">
            {totalProducts.length >=0 ? totalProducts.map((meal) => (
              <div
                key={meal._id}
                onClick={() => handleProductClick(meal._id)}
                className="min-w-[150px] h-32 bg-green-200/50 shadow-lg border rounded-lg overflow-hidden relative flex flex-col "
              >
                <h3 className="text-center self-start text-lg font-bold ml-2 mt-2">{meal._id}</h3>
                <img src={meal.products[0].image} alt={meal.name} className="w-28 h-28 left-[30%] top-[32%] rounded-full absolute" />
              </div>
            )) : "No products found"}
          </div>
        </div>
      </div> */}
      <div className={`mainitems min-h-screen relative top-[-104px] px-9 py-5 ${showCart ? "pointer-events-none md:pointer-events-auto" : ""} ${showModal && "blureffect"}`}>
        {totalProducts.map((product) => (
          <div
            className="h-auto "
          >
            {currentcategory === "all" ?
              <div className="h-auto text-center text-3xl font-bold my-5">
                {product._id.split(" ", 2)[0]} <span className="text-green-600">{product._id.split(" ", 2)[1]}</span>
              </div> :
              <div className="h-auto text-center text-3xl font-bold">
                {currentcategory.split(" ", 2)[0]} <span className="text-green-600">{currentcategory.split(" ", 2)[1]}</span>
              </div>}
            <div className="myproductsgrid w-full mt-4">
              {product.products.map((item, i) => (
                <>
                  <div key={i} className="bg-white w-full  relative  rounded-lg flex items-center space-x-4 max-w-sm mx-auto md:max-w-lg">

                    <div className="overflow-hidden flex flex-col m-0 w-full">
                      {item.bestsellar ?
                        <div className="w-24 absolute top-0 left-0 ">
                          <BestSellerRibbon />
                        </div>
                        : null}
                      <div className='w-full h-[185px] object-cover'>
                        <img src={item.image} className="w-full mx-auto rounded-[26px] object-fill h-full" alt="Nachos" />
                      </div>
                      <div className='flex justify-between w-full mt-2'>
                        <div className="">
                          <div className="font-bold text-xl ">{item.name}</div>
                          <div className='text-base font-semibold'>₹{item.price}</div>
                          <p className="text-gray-700 text-[12px] mr-3 font-[300] ">
                            {item.description}
                          </p>
                        </div>
                        {cart.findIndex((cartItem) => cartItem._id === item._id) === -1
                          ?
                          <div onClick={() => addtocart(item)} className="addtocart px-7 py-1 rounded-lg h-10 my-auto text-green-600 w-28 flex justify-center items-center bottom-1 left-[8px]  z-10 font-bold text-lg border border-green-700 hover:bg-green-100 transition-colors">
                            ADD
                          </div> :
                          <div className="addtocart flex justify-between items-center  px-4 py-1 rounded-lg h-10 my-auto  w-32  bottom-1 left-[8px]  z-10 font-bold text-lg  transition-colors">
                            <div
                              onClick={() => removefromcart(cart[cart.findIndex((cartItem) => cartItem._id === item._id)])}
                              className="w-10 h-full flex items-center justify-center  cursor-pointer text-green-700 font-bold text-3xl pb-1 rounded-l-lg"
                            >
                              <img src="/homepage/Less Icon.svg" alt="" />
                            </div>

                            <div className="w-8 h-full flex items-center justify-center font-bold text-xl text-green-700">
                              {cart[cart.findIndex((cartItem) => cartItem._id === item._id)].quantity}
                            </div>

                            <div
                              onClick={() => addtocart(cart[cart.findIndex((cartItem) => cartItem._id === item._id)])}
                              className="w-10 h-full flex items-center justify-center cursor-pointer font-bold text-2xl pb-1 rounded-r-lg"
                            >
                              <img src="/homepage/Add to car Icon.svg" alt="" />
                            </div>
                          </div>
                        }
                      </div>

                      <Separator className=" mt-1 w-auto bg-green-200" />
                    </div>

                    {/* <div className="flex-shrink-0 relative">
                    <img
                      src={item.image}
                      alt="Vegetable Curry"
                      className="w-28 h-28 shadow-2xl rounded-full object-cover relative bottom-7"
                    />
                    <div onClick={() => addtocart(item)} className="addtocart px-7 py-1 rounded-lg text-green-600 absolute bottom-1 left-[8px] bg-green-50 z-10 font-bold text-lg border border-green-700 hover:bg-green-100 transition-colors">
                      ADD
                      <img className="w-3 absolute top-[2px] right-[3px] font-bold" src="/homepage/add-01-stroke-rounded.svg" alt="" />
                    </div>

                  </div> */}
                    {/* <div className="flex-grow w-full flex flex-col gap-1 text-sm h-28">
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <span className="text-green-600 font-bold text-lg">₹{item.price}</span>
                    <div className="text-gray-500 max-h-9 overflow-auto w-full">{item.description}</div>

                  </div> */}
                  </div>

                </>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`${emptycart ? "fixed bottom-[-100%] " : "fixed bottom-0"} md:w-[50%] md:left-[50%] md:transform md:-translate-x-1/2 transition-all duration-1000 ease-in-out  h-[115px]   bg-green-200/50 w-screen flex justify-around items-center  bg-green-50 z-10 font-bold text-lg hover:bg-green-100 rounded-t-3xl border border-green-300 `}>
        <div className="flex  items-center text-3xl w-full font-semibold justify-center gap-[30px] md:gap-[20%] text-green-700">
          <div className=" text-center font-bold text-[28px] text-black"> ₹{totalprice}</div>
          <div className="w-fit text-center">
            <div className="w-[160px] flex gap-2 bg-green-700 rounded-xl items-center justify-center h-[56px] p-1 px-4 text-white text-lg">
              <span className="text-[18px] font-bold" onClick={() => { setshowCart(true) }}>Checkout</span>
              <img className="w-5 h-5" src="/homepage/cart.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className={`stikyfooter ${!emptycart ? "fixed bottom-[-100%] " : "fixed bottom-0"} md:w-[50%] md:left-[50%] md:transform md:-translate-x-1/2 border border-green-300 transition-all duration-1000 ease-in-out bottom-0 bg-green-200/50 w-screen h-16 rounded-t-3xl flex justify-around items-center  bg-green-50 z-10 font-bold text-lg hover:bg-green-100`}>
        <div className="p-2 rounded-full shadow-lg bg-green-600 ">
          <img width={25} src="/bar/Home.png" alt="" />
        </div>
        <div onClick={() => setshowCart(true)} className="bg-green-600/50 p-2 rounded-full">
          <img width={25} src="/bar/Cart.png" alt="" />
        </div>
        <div className="bg-green-600/50 p-2 rounded-full">
          <img width={25} src="/bar/Offer.png" alt="" />
        </div>
        <Link href={"http://wa.link/uk3g4c"} target="blank">
          <div className="bg-green-600/50 p-2 rounded-full">
            <img width={25} src="/bar/Chat.png" alt="" />
          </div>
        </Link>
      </div>

      <div className={`h-screen w-[90%] md:w-[30%] fixed border border-green-200 bg-green-700 z-40 top-0 ${showCart ? "left-0" : "left-[-100%]"} rounded-r-[20px] transition-all duration-1000 ease-in-out p-4`}>
        <div onClick={() => { setshowCart(!showCart) }} className="close absolute top-3 right-4">
          <img src="/homepage/cancel-circle-stroke-rounded (1).svg" alt="" />
        </div>
        <div className="w-full text-3xl flex h-[100px] items-center justify-center gap-2 font-bold text-center my-4">

          <span className="p-2 rounded-full bg-green-900"><img width={28} src="/homepage/Vector.svg" alt="" /></span>
          <span className="text-white">
            Cart
          </span>
        </div>
        <Separator className="w-full bg-green-200" />
        <div className="w-full  h-[61%] overflow-y-auto mt-2 scrollbar-hide scroll-smooth">
          {cart.length > 0 && <div className="text-center text-[19px] font-[500] text-white">You have {cart.length} items in the cart</div>}
          <div className="text-center w-full h-full">
            {cart.length === 0 ?
              <>
                <span className="my-auto text-[19px] font-[500] text-white">Your cart is empty</span>

                <div onClick={() => setshowCart(false)} className="text-center w-full flex items-center justify-center h-full self-center my-auto text-[19px] font-[500] text-white">
                  <img src="/slidebar/Add to car Icon.svg" alt="" />
                </div>
              </> :

              cart.map((item, i) => (
                <>
                  <div key={i} className="w-full relative text-white rounded-lg flex items-center my-3 space-x-4 max-w-sm mx-auto md:max-w-lg">
                    <div className="flex-shrink-0 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 shadow-2xl rounded-full object-cover relative"
                      />
                      {/* <div className="addtocart flex w-[96px] justify-around h-9 rounded-lg text-green-600 absolute bottom-1 left-[8px] bg-green-50 z-10 font-bold text-lg border border-green-700 hover:bg-green-100 transition-colors">
                    <div
                      onClick={() => removefromcart(item)}
                      className="w-10 h-full flex items-center justify-center bg-green-200 hover:bg-green-300 cursor-pointer text-green-700 font-bold text-3xl pb-1 rounded-l-lg"
                    >
                      -
                    </div>

                    <div className="w-8 h-full flex items-center justify-center font-bold text-green-700">
                      {item.quantity}
                    </div>

                    <div
                      onClick={() => addtocart(item)}
                      className="w-10 h-full flex items-center justify-center bg-green-200 hover:bg-green-300 cursor-pointer text-green-700 font-bold text-2xl pb-1 rounded-r-lg"
                    >
                      +
                    </div>
                  </div> */}
                    </div>
                    <div>
                      <div className="flex-grow w-[81px] flex flex-col justify-center gap-1 text-sm h-28">
                        <h2 className="text-[15px] font-[500]">{item.name}</h2>
                        <span className="text-white font-[500] text-[15px]">₹{item.price}</span>

                      </div>
                      <span className="absolute -top-1 right-0 w-6" onClick={() => { deleteitemfromcart(item) }}>
                        <img src="/homepage/cancel-circle-stroke-rounded (1).svg" alt="" />
                      </span>
                    </div>
                    <div className="w-[100px] text-[15px] ml-auto flex items-center justify-end flex-col relative  font-[500]">
                      <div className="addtocart flex justify-between items-center  py-1 rounded-lg h-10 my-auto  w-20  bottom-1 left-[8px]  z-10 font-bold text-lg  transition-colors">
                        <div
                          onClick={() => removefromcart(item)}
                          className="w-10 h-full flex items-center justify-center  cursor-pointer text-green-700 font-bold text-3xl pb-1 rounded-l-lg"
                        >
                          <img src="/homepage/Less Icon.svg" alt="" />
                        </div>

                        <div className="w-8 h-full flex items-center justify-center font-bold text-xl text-white-700">
                          {item.quantity}
                        </div>

                        <div
                          onClick={() => addtocart(item)}
                          className="w-10 h-full flex items-center justify-center cursor-pointer font-bold text-2xl pb-1 rounded-r-lg"
                        >
                          <img src="/homepage/Add to car Icon.svg" alt="" />
                        </div>
                      </div>

                    </div>

                  </div>
                  <Separator className="w-full bg-green-200/50" />
                </>
              ))}
          </div>

        </div>
        <div>
          <div>
            <div className="w-full text-[18px] text-white flex justify-around font-bold text-center mt-4">
              <span>
                Total :
              </span>
              <span >
                ₹{totalprice}
              </span>
            </div>
          </div>
          <button onClick={() => { handlepayment() }} className="h-10 w-full focus:bg-yellow-100 bg-yellow-400 text-white my-4 flex justify-center gap-2 items-center rounded-xl py-6 p-2">
            <span className="text-[18px] bg-transparent text-green-700 font-bold" >{isofftime ? "Place preorder" : "Checkout"}</span>
            <img className="w-5 text-green-700 h-5" src="/homepage/vector2.svg" alt="" />
          </button>
        </div>

      </div>
      <Footer />
    </>
  );
}
