import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function Hero() {
  const [currentHero, setCurrentHero] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // CSS for handling the line break responsively - hide on mobile, show on larger screens
  const brStyle = {
    '@media (max-width: 767px)': {
      display: 'none',
    },
  };
  
  useEffect(() => {
    // Animation for progress that also controls hero transition
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          // Incrementos para completar em aproximadamente 7 segundos
          return prev + (100 / 70); // 100% em 7000ms (70 etapas de 100ms)
        } else {
          // Garantir a ordem correta de transição: 0 -> 1 -> 2 -> 0
          if (currentHero === 0) setCurrentHero(1);
          else if (currentHero === 1) setCurrentHero(2);
          else if (currentHero === 2) setCurrentHero(0);
          return 0; // Reiniciar o progresso
        }
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, [currentHero]); // Adicionado currentHero como dependência
  
  // Função para alternar hero manualmente ao clicar nos indicadores
  const changeHero = (index: number) => {
    setCurrentHero(index);
    setProgress(0); // Reiniciar o progresso quando mudar manualmente
  };
  
  return (
    <div className="relative">
      {currentHero === 0 && (
        <section className="relative text-cream overflow-hidden h-[180px] md:h-[570px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/123123.jpeg"
              alt="Fundo com animais de fazenda"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 py-6 md:py-16 lg:py-24 relative z-10 h-full flex items-center">
            <div className="max-w-2xl ml-auto mr-0 md:mr-8 text-right">
              <h1 className="font-bold mb-0.5 md:mb-4 font-conneqt">
                <span className="md:inline flex flex-col">
                  <span className="text-lg md:text-3xl lg:text-4xl text-[#f5f0de] font-normal" 
                        style={{ WebkitTextStroke: '1px #f5f0de' }}>
                    Soluções Premium de
                  </span>
                  <br className="hidden md:inline" />
                  <span className="text-xl md:text-3xl lg:text-5xl text-[#f5f0de] font-normal mt-0 md:mt-1" 
                        style={{ WebkitTextStroke: '1px #f5f0de' }}>
                    Ração Animal
                  </span>
                </span>
              </h1>
              <div className="flex justify-end mt-0 md:mt-1 mb-1 md:mb-2">
                <Image
                  src="/images/fio.png"
                  alt="Separador decorativo"
                  width={420}
                  height={40}
                  className="object-contain w-[160px] md:w-[240px] lg:w-auto"
                />
              </div>
              <p className="text-xs md:text-base lg:text-lg mb-2 md:mb-6 text-cream [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
                Melhore a saúde, produtividade e crescimento do seu rebanho com os produtos de ração cientificamente
                formulados da Nutriserra.
              </p>
              <div className="flex flex-wrap gap-1 md:gap-4 justify-end">
                <Button size="sm" className="bg-cream hover:bg-cream/90 text-darkGreen font-bold text-[10px] md:text-sm py-1 h-auto md:h-auto">Ver Produtos</Button>
                <Button size="sm" variant="outline" className="bg-darkGreen2 border-darkGreen2 text-cream hover:bg-darkGreen/40 font-bold text-[10px] md:text-sm py-1 h-auto md:h-auto">
                  Falar com Vendas
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {currentHero === 1 && (
        <section className="relative text-cream overflow-hidden h-[180px] md:h-[570px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/121213.jpg"
              alt="Fundo hero 2"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 py-2 md:py-16 lg:py-24 relative z-10 h-full">
            <div className="h-full w-full flex flex-col justify-center">
              <div className="w-full flex justify-end md:justify-start">
                <div className="md:ml-8">
                  <div className="flex-wrap gap-1 md:gap-4 flex justify-end md:justify-start mt-[50px] md:mt-[385px]">
                    <Button size="sm" className="bg-cream hover:bg-cream/90 text-darkGreen font-bold text-[10px] md:text-sm py-1 h-auto md:h-auto">Ver Produtos</Button>
                    <Button size="sm" variant="outline" className="bg-darkGreen2 border-darkGreen2 text-cream hover:bg-darkGreen/40 font-bold text-[10px] md:text-sm py-1 h-auto md:h-auto">
                      Falar com Vendas
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {currentHero === 2 && (
        <section className="relative text-cream overflow-hidden h-[180px] md:h-[570px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/121212.jpg"
              alt="Fundo hero 3"
              fill
              className="object-cover object-[70%_center] md:object-center"
              priority
            />
          </div>
          <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24 relative z-10 h-full flex items-center">
            <div className="max-w-2xl ml-auto mr-0 md:mr-8 text-right">
              <div className="flex flex-wrap gap-1 md:gap-4 justify-end mt-[50px] md:mt-[340px]">
                <Button size="sm" className="bg-cream hover:bg-cream/90 text-darkGreen font-bold text-[10px] md:text-sm py-1 h-auto md:h-auto">Ver Produtos</Button>
                <Button size="sm" variant="outline" className="bg-darkGreen2 border-darkGreen2 text-cream hover:bg-darkGreen/40 font-bold text-[10px] md:text-sm py-1 h-auto md:h-auto">
                  Falar com Vendas
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Indicadores de navegação */}
      <div className="absolute bottom-2 md:bottom-4 left-0 right-0 z-20 flex justify-center gap-1 md:gap-2">
        {[0, 1, 2].map((index) => (
          <div 
            key={index}
            className="relative"
            onClick={() => changeHero(index)}
          >
            <div 
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full cursor-pointer transition-all ${
                currentHero === index 
                  ? "bg-darkGreen scale-110 md:scale-125" 
                  : "bg-darkGreen/50 hover:bg-darkGreen/70"
              }`}
            ></div>
            
            {currentHero === index && (
              <svg 
                className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 transform -rotate-90" 
                viewBox="0 0 32 32"
              >
                <circle
                  className="text-[#edb200]"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="14"
                  cx="16"
                  cy="16"
                  style={{
                    strokeDasharray: '87.9646',
                    strokeDashoffset: `${87.9646 - (87.9646 * progress) / 100}`,
                    transition: 'stroke-dashoffset 0.1s linear'
                  }}
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
