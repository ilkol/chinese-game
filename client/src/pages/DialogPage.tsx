import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

import greatingChar from '/assets/chars/lun-lun/greatings.png';
import shyChar from '/assets/chars/lun-lun/shy.png';
import calmChar from '/assets/chars/lun-lun/calm.png';
import loveChar from '/assets/chars/lun-lun/love.png';
import pandaExcited from '../assets/excited.png';

interface Photo {
	src: string;
	alt: string;
	size: string;
}
interface Video {
	src: string;
	muted: boolean;
}

interface Step {
	id: number;
	text?: string;
	speaker?: string;
	emotion?: string; // Путь к изображению эмоции
	bg: string; // Цвет фона
	video?: Video; // Информация о видео
	photo?: Photo; // Информация о фото
}

const pandaColor = "blue";
const charColor = "purple";

const steps: Step[] = [
	{
		id: 1,
		text: "Привет-привет! Я Лун Лун – твой проводник в волшебный мир китайского языка. Ты готов к приключениям? Тогда слушай внимательно!",
		speaker: "Лун Лун",
		emotion: greatingChar,
		bg: charColor
	},
	{
		id: 2,
		text: "Знаешь, в китайском языке совсем нет букв, как в русском или английском! Вместо них там живут *иероглифы* – это такие маленькие картинки-символы. Каждый иероглиф похож на рисунок означает целое слово или его часть.",
		speaker: "Лун Лун",
		bg: charColor,
		photo: {
			src: "/assets/levels/1/1.png",
			alt: "Описание фото",
			size: "2xl"
		}
	},
	{
		id: 3,
		text: "Круто, да? Но как же узнать, как произносить эти картинки? Для этого придумали *пиньинь* – это специальная запись с помощью знакомых английский букв, которая подсказывает, как читается иероглиф. Инициаль - это начальный согласный звук слога Финаль - это гласный или сочетание гласных в конце слога",
		speaker: "Лун Лун",
		bg: charColor,
		photo: {
			src: "/assets/levels/1/2.jpeg",
			alt: "Описание фото",
			size: "md"
		}
	},
	{
		id: 4,
		text: "А теперь – самое интересное! В китайском языке есть *тоны*. Это как музыка – один и тот же слог можно спеть по-разному, и его значение изменится! Представь, что ты говоришь слово «мама», но если изменить голос, то получится «лошадь».",
		speaker: "Лун Лун",
		emotion: shyChar,
		bg: charColor,
	},
	{
		id: 5,
		text: "А теперь давай я расскажу про тона по подробнее! Чтобы тебе было понятнее, посмотри как я летаю на своей космическом корабле!",
		speaker: "Лун Лун",
		emotion: calmChar,
		bg: charColor,
	},
	{
		id: 6,
		speaker: "Лун Лун",
		text: "Первый тон – ровный и высокий, как будто ты поёшь одну ноту!",
		video: {
			src: "/assets/levels/1/video/1.mov",
			muted: false,
		},
		bg: charColor,
	},
	{
		id: 7,
		speaker: "Лун Лун",
		text: "Второй тон – голос идёт вверх, как при удивлении!",
		video: {
			src: "/assets/levels/1/video/2.mov",
			muted: false,
		},
		bg: charColor,
	},
	{
		id: 8,
		speaker: "Лун Лун",
		text: "Третий тон – голос сначала опускается, потом поднимается!",
		video: {
			src: "/assets/levels/1/video/3.mov",
			muted: false,
		},
		bg: charColor,
	},
	{
		id: 9,
		speaker: "Лун Лун",
		text: "Четвёртый тон – резко падает вниз, как когда мы сердимся!",
		video: {
			src: "/assets/levels/1/video/4.mov",
			muted: false,
		},
		bg: charColor,
	},
	{
		id: 10,
		speaker: "Лун Лун",
		text: "Четвёртый тон – резко падает вниз, как когда мы сердимся!",
		video: {
			src: "/assets/levels/1/video/5.mp4",
			muted: false,
		},
		bg: charColor,
	},
	{
		id: 11,
		speaker: "Лун Лун",
		text: "Теперь я предлагаю познакомиться с пиньинем и тонами поближе! Я буду показывать тебе гласные, а ты должен повторять. Сначала мы с тобой выучим гласные буквы. Готов? Поехали!",
		emotion: loveChar,
		bg: charColor,
	},
	{
		id: 12,
		speaker: "Лун Лун",
		text: "Повторяй за мной!",
		video: {
			src: "/assets/levels/1/video/test.mov",
			muted: false,
		},
		bg: charColor,
	},
	{
		id: 13,
		speaker: "Сяо Син",
		emotion: pandaExcited,
		text: "Ты супер-ученик! У тебя классно получилось повторить гласные буквы, а теперь давай потренируемся!",
		bg: pandaColor,
	},
];

const DelayedVideo = ({ src, muted }: { src: string, muted: boolean}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 400);
    return () => {
      clearTimeout(timer);
      setIsReady(false);
    };
  }, [src]);

  return (
    <AnimatePresence>
      {isReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Растягиваем контейнер на весь экран поверх фонового JPEG
          className="absolute inset-0 z-0 w-full h-full overflow-hidden"
        >
          <video 
            autoPlay 
            muted={muted} 
            loop 
            playsInline 
            // КЛЮЧЕВОЙ КЛАСС: object-cover заставит видео заполнить весь экран
            className="w-full h-full object-cover"
          >
            <source src={src} type="video/mp4" />
          </video>
          
          {/* Градиент, чтобы текст внизу читался на фоне любого видео */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DialogView = ({ onComplete }: { onComplete: () => void }) => {
	const [currentStep, setCurrentStep] = useState(0);


	const next = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			onComplete();
		}
	};

	return (
		<div className={`fixed inset-0 z-0 transition-colors duration-1000 bg-center bg-cover bg-no-repeat overflow-hidden flex flex-col justify-between p-4 md:p-8`}
			style={{
				backgroundImage: `url("/assets/levels/1/bg.jpeg")`,
			}}
		>
				{steps[currentStep].video && (
					<DelayedVideo
						src={steps[currentStep].video.src}
						muted={steps[currentStep].video.muted}
					/>
				)}

				{steps[currentStep].photo && (
					<AnimatePresence>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 z-0"
						>
							<img 
								src={steps[currentStep].photo.src} 
								alt={steps[currentStep].photo.alt} 
								className={`max-w-${steps[currentStep].photo.size} top-10 mx-auto relative`} 
							/>
						</motion.div>
					</AnimatePresence>
				)}



			<div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-32 pointer-events-none z-10">
				<AnimatePresence mode="popLayout">
					{/* Добавляем проверку на существование эмоции */}
					{steps[currentStep].emotion && (
						<div className="relative">
							<motion.img
								key={currentStep}
								src={steps[currentStep].emotion}
								initial={{ opacity: 0, y: 20, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 20, scale: 1.05 }}
								transition={{ duration: 0.2 }}
								className="h-[55vh] object-contain z-10"
							/>
						</div>
					)}
				</AnimatePresence>
			</div>
			{/* 3. Диалоговое окно (Interface) */}
			<div className="absolute inset-x-0 bottom-0 p-6 z-20">
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="max-w-2xl mx-auto relative"
				>
					{/* Имя говорящего */}
					{steps[currentStep].speaker && (
						<div className={`absolute -top-6 left-6 bg-${steps[currentStep].bg}-600 text-white px-6 py-1 rounded-full font-black text-sm uppercase tracking-widest shadow-lg`}>
							{steps[currentStep].speaker}
						</div>
					)}

					{/* Плашка с текстом */}
					<div
						onClick={next}
						className="bg-black/60 backdrop-blur-xl border-2 border-white/20 rounded-[32px] p-8 pt-10 min-h-[160px] cursor-pointer hover:border-white/40 transition-all shadow-2xl"
					>
						{steps[currentStep].text && (
							<p className="text-white text-lg md:text-xl font-medium leading-relaxed">
								{steps[currentStep].text.split(/(\*[^*]+\*)/g).map((part, index) => {
									if (part.startsWith('*') && part.endsWith('*')) {
										return (
											<span key={index} className={`font-black text-${steps[currentStep].bg}-300`}>
												{part.slice(1, -1)}
											</span>
										);
									}
									return part;
								})}
							</p>
						)}

						{/* Индикатор клика */}
						<div className="absolute  bottom-2 right-8 flex items-center gap-2 text-white/40 animate-pulse text-xs font-bold uppercase">
							Нажми, чтобы продолжить <ChevronRight size={16} />
						</div>
					</div>
				</motion.div>
			</div>

			{/* Прогресс-бар сверху */}
			<div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
				{steps.map((_, i) => (
					<div
						key={i}
						className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}
					/>
				))}
			</div>
		</div>
	);
};

export default DialogView;
