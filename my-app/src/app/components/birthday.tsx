"use client"; // Enables client-side rendering for this component

// Import necessary dependencies 
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaBirthdayCake, FaGift } from 'react-icons/fa'
import { GiBalloons } from 'react-icons/gi';
import Image from 'next/image';
import { FaCakeCandles } from 'react-icons/fa6';
import * as htmltoImage from 'html-to-image'

// Import dynamicallly the Confetti component
const ConfettiDynamic = dynamic(() => import('react-confetti'), { ssr: false });

// Define type for Confetti component props
type ConfettiProps = {
    width: number;
    height: number;
};

// Define color arrays for candles, balloons, and confetties
const candles_Colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
const balloons_Colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
const confetti_Colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

const BirthdayWish = () => {

    interface FormData {
        event: string;
        wish: string;
        wishImage: string | null;
    }

    // For form
    const [formData, setFormData] = useState({ event: "", wish: "", wishImage: "" }); // State to take input from user 
    const [wishImage, setImage] = useState<string | null>(null);
    const [submitData, setSubmitData] = useState<FormData | null>(null);

    // For card
    const [candle, setCandle] = useState<number>(0); // Set the statement to track the candles
    const [balloonsPopped, setBalloonsPopped] = useState<number>(0); // Set the statement to track the balloons
    const [confetti, setConfetti] = useState<boolean>(false); // Set the statement to show the confetti after all candles and balloons are completed
    const [confettiSize, setConfettiSize] = useState<ConfettiProps>({ width: 0, height: 0 }); // Set the statement to set the size of confetti
    const [celeberating, setCeleberating] = useState<boolean>(false); // Set the statement to celeberate
    const cardRef = useRef<HTMLDivElement>(null);

    const total_candles = 5; // Total candles which is show
    const total_balloons = 5; // Total candles which is show

    // For form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && file.type.startsWith('image/')) {
            setImage(URL.createObjectURL(file));
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.event && formData.wish) {
            setSubmitData({ ...formData, wishImage });
            setFormData({ event: "", wish: "", wishImage: "" })
            setImage(null);
        } else {
            alert("Please fill out all the fields!")
        }
    }

    const downLoadCard = async () => {
        const cardElement = cardRef.current
        if (cardElement) {
            try {
            const data = await htmltoImage.toPng(cardElement, {backgroundColor:'white'})
            const link = document.createElement('a')
            link.href = data;
            link.download = `birthday_wish_card.png`
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            } catch (error) {
                console.error('Error to download the card', error)
                alert('Failed to download')
            }

        } else {
            alert('Card element not found!')
        }
    }


    // use useEffect to resize the confetti
    useEffect(() => {
        const handleResize = () => {
            setConfettiSize({ width: window.innerWidth, height: window.innerHeight });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, []);

    // Function of effect to show confetti when all candles are light and balloons are popped 
    useEffect(() => {
        if (candle === total_candles && balloonsPopped === total_balloons) {
            setConfetti(true)
        }
    }, [candle, balloonsPopped]);

    // Funnction to light the candles one by one
    const candleLight = (index: number) => {
        if (index === candle) {
            setCandle((prev) => prev + 1)
        };
    }

    // Function to pop the balloons one by one
    const balloonsPop = (index: number) => {
        if (index === balloonsPopped) {
            setBalloonsPopped((prev) => prev + 1)
        }
    };

    // Function to start the celeberation
    const celeberate = () => {
        setCeleberating(true);
        setConfetti(true);
        const interval = setInterval(() => {
            setCandle((prev) => (prev < total_candles ? prev + 1 : prev));
        }, 500);
        return () => clearInterval(interval);
    };

    useEffect(() => {
        if('serviceWorker' in navigator) {
            navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed', error)
            })
        }
    }, [])

    return (
        <div className='text-2xl font-medium bg-blue-100 rounded-md border-l ml-60 mr-60 mt-10 mb-10 shadow-md shadow-blue-300'>
            {!submitData ? (
                <form onSubmit={handleSubmit} className='items-center text-2xl font-medium rounded-md border-1 text-center m-5'>
                    <div className='p-7'>
                        <p
                            className='text-5xl text-center font-bold m-4 p-2 text-blue-900'
                        >
                            Birthday Wish App
                        </p>
                        <h1
                            className='text-3xl m-1'
                        >
                            Event name:
                        </h1>
                        <input
                            type="text"
                            placeholder="Enter the event name"
                            value={formData.event}
                            name='event'
                            onChange={handleChange}
                            className='bg-blue-50 rounded-lg m-1 text-3xl border-2 border-blue-600'
                        />
                        <br />

                        <h1
                            className='text-3xl m-1'
                        >
                            Wish:
                        </h1>
                        <input
                            type="text"
                            placeholder="Enter the wish"
                            value={formData.wish}
                            name='wish'
                            onChange={handleChange}
                            className='bg-blue-50 rounded-lg m-1 text-3xl border-2 border-blue-600'
                        />
                        <br />

                        <h1
                            className='text-3xl m-1'
                        >
                            Select the images:
                        </h1>
                        <input
                            type="file"
                            accept="image/"
                            onChange={handleImage}
                            className='m-5'
                        />
                        <br />

                        <button
                            type="submit"
                            className='bg-blue-700 text-white p-2 rounded-xl m-2 shadow-sm shadow-blue-900'
                        >
                            Submit
                        </button>
                    </div>
                </form>
            ) : (
                     <div
                     ref={cardRef}
                     >
                    <div
                            className='text-center items-center p-5'
                          >
    
                            <h1
                                className='text-5xl font-bold text-blue-900 text-center p-2.5 flex gap-5'
                            >
                                <FaCakeCandles className='size-8' />{submitData.event}<FaCakeCandles className='size-8' />
                            </h1>
                            <h3
                                className='text-3xl font-semibold text-blue-900 text-center p-2.5'
                            >
                                {submitData.wish}
                            </h3>
                            <div
                                className='ml-28'
                            >
                                {submitData.wishImage &&
                                    <Image
                                        src={submitData.wishImage}
                                        alt="upload"
                                        width="200"
                                        height="200"
                                        className='rounded-3xl border-2 border-black m-5 ml-44 items-center' />}
                            </div>
                        </div><h2
                            className='text-3xl m-2 text-center '
                        >
                                Light the candles:
                            </h2><div
                                className='flex justify-center gap-2 m-3'
                            >
                                {[...Array(total_candles)].map((_, index) => (
                                    <AnimatePresence key={index}>
                                        {(celeberating && index <= candle) || (!celeberating && index < candle) ? (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ duration: 0.5, delay: celeberating ? index * 0.5 : 0 }}
                                            >
                                                <FaBirthdayCake
                                                    key={index}
                                                    onClick={() => candleLight(index)} />
                                            </motion.div>
                                        ) : (
                                            <FaBirthdayCake
                                                style={{ color: candles_Colors[index % candles_Colors.length] }}
                                                onClick={() => candleLight(index)} />
                                        )}
                                    </AnimatePresence>
                                ))}
                            </div><h3
                                className='text-3xl m-3 text-center'
                            >
                                Pop the balloons:
                            </h3><div
                                className='flex justify-center gap-2'
                            >
                                {[...Array(total_balloons)].map((_, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 1 }}
                                        animate={{ scale: index < balloonsPopped ? 0 : 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <GiBalloons
                                            style={{ color: index < balloonsPopped ? '#D1D5DB' : balloons_Colors[index % balloons_Colors.length] }}
                                            onClick={() => balloonsPop(index)} />
                                    </motion.div>
                                ))}
                            </div><div
                                className='flex justify-center gap-3'
                            >
                                <button
                                    onClick={celeberate}
                                    disabled={celeberating}
                                >
                                    Celeberate!<FaGift />
                                </button>
                                {confetti && (
                                    <ConfettiDynamic
                                        width={confettiSize.width}
                                        height={confettiSize.height}
                                        recycle={false}
                                        numberOfPieces={500}
                                        colors={confetti_Colors}
                                         />
                                )}
    
                            </div>
                            
                        </div>
 
               

            )}
                        <button
                            onClick={downLoadCard}
                            className='bg-blue-700 text-white rounded-lg p-1 shadow-md shadow-blue-800'
                            disabled={!submitData}
                        >
                            Download
                        </button>




                </div>

            )


            }
            export default BirthdayWish
