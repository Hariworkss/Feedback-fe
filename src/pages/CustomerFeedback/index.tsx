import React, { useState, useRef, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Header from './Header';
import { auth, logOut, signInWithGoogle } from '../../components/firebase/firebase';
import { onAuthStateChanged, User } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { getFeedback, postFeedbackApi } from '../../services/allApis';
import { TbLogout } from 'react-icons/tb';
import toast, { Toaster } from 'react-hot-toast';

const labels: { [index: string]: string } = {
    1: 'Dis-satisfied',
    2: 'Satisfied',
    3: 'Good',
    4: 'Excellent',
};

function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const questions = [
    "overallExperience",
    "qualityOfSpeakers",
    "eventOrganization",
    "networkingOpportunities",
];

const questionsLabels = [
    "Overall experience at the event",
    "Quality of the speakers/presenters",
    "Event's organization and logistics",
    "Networking opportunities provided",
];

interface FormData {
    overallExperience: number | null;
    qualityOfSpeakers: number | null;
    eventOrganization: number | null;
    networkingOpportunities: number | null;

    eventContentRelevant: string;
    eventLocationConvenient: string;
    eventMetExpectations: string;
    communication: number | null;
    management: number | null;

    favoriteSession: string;
    improvementsForFuture: string;
    recommendationLikelihood: string;
}

const initialFormData: FormData = {
    overallExperience: null,
    qualityOfSpeakers: null,
    eventOrganization: null,
    networkingOpportunities: null,
    eventContentRelevant: '',
    eventLocationConvenient: '',
    eventMetExpectations: '',
    communication: null,
    management: null,
    favoriteSession: '',
    improvementsForFuture: '',
    recommendationLikelihood: '',
};

const CustomerFeedback: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [hover, setHover] = useState<number[]>(Array(questions.length).fill(-1));
    const [error, setError] = useState<string>('');
    const [ratingErrors, setRatingErrors] = useState<boolean[]>(Array(questions.length).fill(false));
    // const [accoladesError, setAccoladesError] = useState<boolean>(false);
    const [improvementsError, setImprovementsError] = useState<boolean>(false);
    // const [commentsError, setCommentsError] = useState<boolean>(false);
    // const [selectFieldErrors, setSelectFieldErrors] = useState<{ [key: string]: boolean }>({
    //     eventContentRelevant: false,
    //     eventLocationConvenient: false,
    //     eventMetExpectations: false
    // });
    const [user, setUser] = useState<User | null>(null);

    const ratingRefs = useRef<Array<HTMLDivElement | null>>(Array(questions.length).fill(null));
    const accoladesRef = useRef<HTMLTextAreaElement | null>(null);
    const improvementsRef = useRef<HTMLTextAreaElement | null>(null);
    const commentsRef = useRef<HTMLTextAreaElement | null>(null);

    const handleRatingChange = (index: keyof FormData, newValue: number | null) => {
        setFormData({ ...formData, [index]: newValue });
        if (newValue !== null) {
            setRatingErrors(ratingErrors.map((error, i) => (i === questions.indexOf(index) ? false : error)));
        }
    };

    const handleHoverChange = (index: number, newHover: number) => {
        const newHoverStates = [...hover];
        newHoverStates[index] = newHover;
        setHover(newHoverStates);
    };

    const handleLogout = async () => {
        try {
            await logOut();
            setFormData(initialFormData); // Clear form data on logout
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleSubmit = async () => {
        let isValid = true;
        const newRatingErrors = [...ratingErrors];

        // Validate all rating fields
        questions.forEach((question, index) => {
            if (formData[question as keyof FormData] === null || formData[question as keyof FormData] === undefined) {
                newRatingErrors[index] = true;
                isValid = false;
            } else {
                newRatingErrors[index] = false;
            }
        });

        setRatingErrors(newRatingErrors);

        // Validate select fields
        // const newSelectFieldErrors = { ...selectFieldErrors };
        // Object.keys(newSelectFieldErrors).forEach((key) => {
        //     if (formData[key as keyof FormData] === '') {
        //         newSelectFieldErrors[key] = true;
        //         isValid = false;
        //     } else {
        //         newSelectFieldErrors[key] = false;
        //     }
        // });
        // setSelectFieldErrors(newSelectFieldErrors);

        // Validate text areas
        // setAccoladesError(formData.favoriteSession === '');
        setImprovementsError(formData.improvementsForFuture === '');
        // setCommentsError(formData.recommendationLikelihood === '');

        // if (formData.favoriteSession === '') {
        //     accoladesRef.current?.scrollIntoView({ behavior: 'smooth' });
        //     isValid = false;
        // }

        if (formData.improvementsForFuture === '') {
            improvementsRef.current?.scrollIntoView({ behavior: 'smooth' });
            isValid = false;
        }

        // if (formData.recommendationLikelihood === '') {
        //     commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
        //     isValid = false;
        // }

        if (!isValid) {
            setError('Please fill in all required fields.');
            toast.error('Please fill in all required fields.');
            return;
        }

        const feedbackData = {
            userId: user?.uid,
            userEmail: user?.email,
            ...formData
        };

        try {
            await postFeedbackApi(feedbackData);
            setError('');
            toast.success('Feedback submitted successfully');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError('Failed to submit feedback. Please try again.');
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                loadFeedback(currentUser.email as any);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadFeedback = async (userEmail: string) => {
        try {
            const feedback = await getFeedback(userEmail);
            if (feedback.data && feedback.data.data) {
                const feedbackData = feedback.data.data;
                setFormData({
                    overallExperience: parseInt(feedbackData.overallExperience, 10) || null,
                    qualityOfSpeakers: parseInt(feedbackData.qualityOfSpeakers, 10) || null,
                    eventOrganization: parseInt(feedbackData.eventOrganization, 10) || null,
                    networkingOpportunities: parseInt(feedbackData.networkingOpportunities, 10) || null,
                    eventContentRelevant: feedbackData.eventContentRelevant || '',
                    eventLocationConvenient: feedbackData.eventLocationConvenient || '',
                    eventMetExpectations: feedbackData.eventMetExpectations || '',
                    communication: parseInt(feedbackData.communication, 10) || null,
                    management: parseInt(feedbackData.management, 10) || null,
                    favoriteSession: feedbackData.favoriteSession || '',
                    improvementsForFuture: feedbackData.improvementsForFuture || '',
                    recommendationLikelihood: feedbackData.recommendationLikelihood || '',
                });
            }
        } catch (error) {
            console.error('Error loading feedback:', error);
        }
    };

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    if (!user) {
        return (
            <>
            <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
                {/* nav */}
                <div className='w-full h-[60px] bg-blue-950 flex justify-between px-6 '>
                    <div className='flex'>
                        {/* <img className=' mt-[10px] rounded-[30px] w-[35px] h-[35px] me-2 ' src="/logo-power.svg" alt="" /> */}
                        <h4 className='text-[#b2c1cb] mt-3 text-xl font-bold italic'></h4>

                    </div>
                </div>

                {/* login page */}
                <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_135%_at_50%_10%,#fff_40%,#27278f_150%)]  flex justify-center items-center ">
                    <div className=" bg-white-A700  text-white-A700 h-[400px] flex flex-col items-center  font-semibold  md:text-2xl lg:text-3xl p-10">
                        <h3 className='text-[35px] font-bold ms-[18px]'>Welcome to <span className=' text-[#15154e]'>Customer Feedback </span> </h3>
                        <p className='text-[18px] font-normal text-[gray] mt-2'>Sign in to provide your feedback</p>
                        <button
                            onClick={signInWithGoogle}
                            className="mt-5 w-[100%] bg-white-A700 text-black-900 border flex justify-center items-center gap-3 rounded-md px-4 py-2 shadow-lg hover:scale-105 duration-150"
                        >
                            <p className='text-[18px]'>Sign in with</p>
                            <FcGoogle />
                        </button>
                    </div>
                    
                </div>
                
            </>
        );
    }

    return (
        <>
            {/* navbar */}
            <div className='w-full h-[60px] bg-blue-950 flex justify-between px-6 '>
                <div className='flex'>
                    {/* <img className=' mt-[10px] rounded-[30px] w-[35px] h-[35px] me-2 ' src="/logo-power.svg" alt="" /> */}
                    <h4 className='text-[#b2c1cb] mt-3 text-xl font-bold italic'></h4>
                </div>

                <button
                    onClick={handleLogout}
                    className=" text-white border flex h-[40px]  justify-center items-center gap-2 rounded-md mt-2 px-2 py-2  shadow-lg hover:scale-105 duration-150"
                >
                    <p>Logout</p>
                    <TbLogout />
                </button>

            </div>    
            <Toaster />

                    <Header />
            <div className="w-full py-[50px] max-w-2xl mx-auto px-[10px] text-left">
                <h3 className="text-2xl font-bold mt-4 text-[#182551]">Please rate your experience with us <br /> On the following criteria:</h3>
                {questions.map((question, index) => (
                    <div
                        key={index}
                        ref={(el) => (ratingRefs.current[index] = el)}
                        className={`mb-3 mt-6 px-3 py-5 border-2 rounded transition-all duration-300 hover:shadow-lg hover:w-[calc(100%+2px)] ${ratingErrors[index] ? 'border-red-500 bg-red-100' : 'border-[gray]'} hover:bg-[#e6ebf5]`}
                    >
                            <h2 className="text-lg font-semibold mb-2">{questionsLabels[index]}</h2>
                            <div className="flex items-center">
                            <Rating
                                name={`hover-feedback-${index}`}
                                value={formData[question as keyof FormData] as number || 0}
                                max={4}
                                precision={1}
                                getLabelText={getLabelText}
                                onChange={(_, newValue) => handleRatingChange(question as keyof FormData, newValue)}
                                onChangeActive={(_, newHover) => handleHoverChange(index, newHover)}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                            {formData[question as keyof FormData] !== null && (//
                                <Box className="ml-2">{labels[hover[index] !== -1 ? hover[index] : (formData[question as keyof FormData] || 0)]}</Box>
                            )}
                        </div>
                        <div className='flex justify-end'><p className='text-red-600 text-[20px] font-bold h-[15px]'>*</p></div>
                    </div>
                ))}
               <div className={`mb-3 mt-6 px-3 py-5 border-2 rounded transition-all duration-300 hover:shadow-lg hover:w-[calc(100%+2px)] hover:bg-[#e6ebf5]`}>
                    <label className="block text-lg font-semibold mb-2">
                        Was the event content relevant to you?
                    </label>
                    <select
                        className="w-full p-2 border rounded"
                        value={formData.eventContentRelevant}
                        onChange={(e) => handleInputChange('eventContentRelevant', e.target.value)}
                    >
                        <option value="">Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>

                <div className={`mb-3 mt-6 px-3 py-5 border-2 rounded transition-all duration-300 hover:shadow-lg hover:w-[calc(100%+2px)] hover:bg-[#e6ebf5]`}>
                    <label className="block text-lg font-semibold mb-2">
                        Was the event location convenient for you?
                    </label>
                    <select
                        className="w-full p-2 border rounded"
                        value={formData.eventLocationConvenient}
                        onChange={(e) => handleInputChange('eventLocationConvenient', e.target.value)}
                    >
                        <option value="">Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>

                <div className={`mb-3 mt-6 px-3 py-5 border-2 rounded transition-all duration-300 hover:shadow-lg hover:w-[calc(100%+2px)]'border-gray-300'
                     hover:bg-[#e6ebf5]`}>
                    <label className="block text-lg font-semibold mb-2">
                        Did the event meet your expectations?
                    </label>
                    <select
                        className="w-full p-2 border rounded"
                        value={formData.eventMetExpectations}
                        onChange={(e) => handleInputChange('eventMetExpectations', e.target.value)}
                    >
                        <option value="">Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div className="mt-8">
                    <p className="font-semibold text-xl">What was your favorite session or topic?</p>
                    <textarea
                        ref={accoladesRef}
                        className={`w-full mt-2 p-2 border rounded border-gray-300`}
                        rows={4}
                        value={formData.favoriteSession}
                        onChange={(e) => setFormData({ ...formData, favoriteSession: e.target.value })}
                    />
                </div>
                <div className="mt-8 w-[103%]">
                    <p className="font-semibold text-xl">What could we improve for future events?</p>
                    <div className='flex'>
                    <textarea
                        ref={improvementsRef}
                        className={`w-full mt-2 me-2 p-2 border rounded ${improvementsError ? 'border-red-500 ' : 'border-gray-300'}`}
                        rows={4}
                        value={formData.improvementsForFuture}
                        onChange={(e) => setFormData({ ...formData, improvementsForFuture: e.target.value })}
                    />
                        <div className='flex justify-end pt-1'><p className='text-red-600 text-[20px] font-bold h-[15px]'>*</p></div>
                    </div>
                    
                        </div>
                <div className="mt-8">
                    <p className="font-semibold text-xl">How likely are you to recommend this event to a colleague or friend?</p>
                    <textarea
                        ref={commentsRef}
                        className={`w-full mt-2 p-2 border rounded border-gray-300`}
                        rows={4}
                        value={formData.recommendationLikelihood}
                        onChange={(e) => setFormData({ ...formData, recommendationLikelihood: e.target.value })}
                    />
                </div>
                <div className="mt-8 max-md:justify-center max-md:flex">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300"
                    >
                        Submit
                    </button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>

            </div>
            <div className=' w-full bg-slate-100 pb-[20px]'>
            <div className="w-full md:flex max-md:justify-center justify-between px-[50px] py-4">
        <img className='rounded-[10px] w-[180px] h-[80px] ms-2 mt-4' src="/cisi.png" alt="" />
        <img className='rounded-[10px] w-[190px] h-[70px]  mt-6' src="/pepper.png" alt="" />
        <img className='rounded-[10px] w-[120px] h-[80px] ms-2 mt-6' src="/seehold.png" alt="" />
        </div>
        <div className='flex mt-3 max-md:justify-center justify-end w-full pe-4'>
            <a href="https://www.bzanalytics.ai/"><h3 className='md:ms-[80px] '>Powered by bzanalytics.ai</h3></a>
        </div>

</div>
        </>
    );
};

export default CustomerFeedback;
