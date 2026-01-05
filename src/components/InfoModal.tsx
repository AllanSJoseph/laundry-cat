import {useEffect} from 'react';
import cat from '/cat.svg';
import {CircleX} from 'lucide-react';

interface InfoModalProps {
    isOpen: boolean,
    onClose: () => void
}

const InfoModal: React.FC<InfoModalProps> = ({isOpen, onClose}) => {
    if (!isOpen) return null;

    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    },[]);

    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      
      
            <div className="
                w-full max-w-4xl
                min-h-[80dvh] max-h-[90dvh]
                bg-white dark:bg-gray-900
                rounded-xl shadow-xl
                flex flex-col
            ">
        
        
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <img src={cat} width={50} height={50}/>
                <h2 className="text-lg dark:text-gray-300 font-semibold">About Laundry Cat</h2>
                <button 
                    className="p-3 rounded-full bg-white dark:bg-gray-900 transition-all duration-200 hover:scale-110 cursor-pointer"
                    onClick={onClose}
                >
                    <CircleX className="w-5 h-5 text-gray-700 dark:text-orange-500" />
                </button>
            </div>

        
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <p>
                Laundry Cat is a simple timer application that will countdown the time your clothes in your washing machine. It is built to remind you that the clothes are in the machine even after the washing is done. When the timer is done Cat will give you a notification reminding about the machine and every 1 minute the notification will pop until you have confirmed on the page.
            </p>

            <h3 className='font-bold'>Why did I built this?</h3>
            <p>
                I have a habit of always forgetting my clothes in the washing machine, when I put it to wash, I go to my room to work or play, and end up only realising at the end of the day. When I come back my clothes will already be rot inside the machine, so I have to wash again 😫. So I thought of building an application to remind me about this, doing a push notification every 1-5 minutes will be enough. <br/>
                So Why not a simple reminder app in my phone will work rt? Yes it is a better option, This is just a useless application I built for fun. 🙃
            </p>

            <h3 className='font-bold'>How do I use it?</h3>
            <p>Pretty simple! When u set the time on your washing machine set the time here too, when it starts, click start, then u can minimize the app and do whatever you want. When the time comes, u will get a notification, then a notification every 1 - 5 minutes. After u have taken out the clothes, simply click on the "I've taken my Clothes" button The app will no longer disturb you.</p>
            
            <a href='https://github.com/AllanSJoseph/laundry-cat' 
            className='inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-700 font-medium py-2 px-4 rounded-lg transition-all duration-200'>
            View Project on GitHub
            </a>
            </div>


      </div>
    </div>
    );
}


export default InfoModal;