import React from 'react';

export function BatPixelLoader({ 
  size = 4, 
  speed = 0.4, 
  className = "",
  showText = true,
  text = "Loading..."
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div 
        className="bat-pixel-animation"
        style={{
          transform: `scale(${size})`,
          animationDuration: `${speed}s`
        }}
      />
      {showText && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .bat-pixel-animation {
            width: 1px;
            height: 1px;
            position: relative;
            left: -32px;
            top: -32px;
            animation: bat-fly steps(1) infinite;
          }

          @keyframes bat-fly {
            0% {
              box-shadow: 
                33px 6px #10b981, 34px 6px #10b981, 35px 6px #10b981, 36px 6px #10b981,
                20px 7px #10b981, 21px 7px #10b981, 22px 7px #10b981, 23px 7px #10b981,
                33px 7px #10b981, 34px 7px #10b981, 35px 7px #065f46, 36px 7px #065f46,
                37px 7px #10b981, 38px 7px #10b981, 39px 7px #10b981, 43px 7px #10b981,
                20px 8px #10b981, 21px 8px #10b981, 22px 8px #10b981, 23px 8px #10b981,
                33px 8px #10b981, 34px 8px #10b981, 35px 8px #065f46, 36px 8px #065f46,
                37px 8px #10b981, 38px 8px #10b981, 39px 8px #10b981, 43px 8px #10b981,
                17px 9px #10b981, 18px 9px #10b981, 19px 9px #10b981, 20px 9px #10b981,
                35px 9px #10b981, 36px 9px #065f46, 37px 9px #065f46, 38px 9px #065f46,
                39px 9px #065f46, 40px 9px #10b981, 41px 9px #10b981, 42px 9px #10b981,
                43px 9px #065f46, 44px 9px #10b981, 45px 9px #10b981;
            }
            14.3% {
              box-shadow: 
                17px 7px #10b981, 37px 7px #10b981, 38px 7px #10b981,
                17px 8px #10b981, 37px 8px #10b981, 38px 8px #10b981,
                16px 9px #10b981, 17px 9px #065f46, 18px 9px #10b981, 19px 9px #10b981,
                36px 9px #10b981, 37px 9px #065f46, 38px 9px #065f46, 39px 9px #10b981,
                43px 9px #10b981, 44px 9px #10b981, 45px 9px #10b981,
                14px 10px #10b981, 15px 10px #10b981, 16px 10px #065f46, 17px 10px #10b981,
                37px 10px #10b981, 38px 10px #10b981, 39px 10px #065f46, 40px 10px #10b981,
                43px 10px #10b981, 44px 10px #065f46, 45px 10px #065f46, 46px 10px #10b981;
            }
            28.6% {
              box-shadow: 
                16px 12px #065f46, 17px 12px #065f46,
                16px 13px #065f46, 17px 13px #065f46,
                16px 14px #065f46, 17px 14px #065f46,
                43px 14px #065f46, 44px 14px #065f46, 45px 14px #065f46,
                16px 15px #065f46, 17px 15px #065f46,
                43px 15px #065f46, 44px 15px #065f46, 45px 15px #065f46,
                12px 16px #065f46, 13px 16px #065f46,
                43px 16px #065f46, 44px 16px #065f46, 45px 16px #065f46,
                12px 17px #065f46, 13px 17px #065f46;
            }
            42.9% {
              box-shadow: 
                47px 14px #065f46, 47px 15px #065f46,
                14px 16px #065f46, 15px 16px #065f46,
                28px 20px #10b981, 29px 20px #10b981, 30px 20px #10b981,
                48px 20px #065f46, 49px 20px #065f46,
                9px 21px #065f46,
                18px 21px #10b981, 19px 21px #10b981, 20px 21px #10b981,
                21px 21px #10b981, 22px 21px #10b981, 23px 21px #10b981,
                27px 21px #10b981, 28px 21px #065f46, 29px 21px #10b981, 30px 21px #10b981,
                20px 22px #10b981, 21px 22px #065f46, 22px 22px #065f46, 23px 22px #065f46,
                24px 22px #10b981, 25px 22px #10b981, 26px 22px #10b981, 27px 22px #10b981,
                28px 22px #065f46, 29px 22px #065f46, 30px 22px #065f46, 31px 22px #10b981;
            }
            57.2% {
              box-shadow: 
                31px 16px #10b981, 32px 16px #10b981,
                31px 17px #10b981, 32px 17px #10b981,
                20px 18px #10b981, 21px 18px #10b981,
                28px 18px #10b981, 29px 18px #10b981, 30px 18px #10b981,
                31px 18px #065f46, 32px 18px #065f46, 33px 18px #10b981, 34px 18px #10b981,
                20px 19px #10b981, 21px 19px #10b981,
                28px 19px #10b981, 29px 19px #10b981, 30px 19px #10b981,
                31px 19px #065f46, 32px 19px #065f46, 33px 19px #10b981, 34px 19px #10b981,
                20px 20px #10b981, 21px 20px #065f46, 22px 20px #10b981, 23px 20px #10b981,
                27px 20px #10b981, 28px 20px #065f46, 29px 20px #10b981, 30px 20px #10b981,
                31px 20px #065f46, 32px 20px #065f46, 33px 20px #10b981, 34px 20px #10b981;
            }
            71.5% {
              box-shadow: 
                32px 15px #10b981, 33px 15px #10b981, 34px 15px #10b981,
                32px 16px #10b981, 33px 16px #10b981, 34px 16px #10b981,
                31px 17px #10b981, 32px 17px #065f46, 33px 17px #065f46,
                34px 17px #065f46, 35px 17px #10b981,
                21px 18px #10b981,
                28px 18px #10b981, 29px 18px #10b981, 30px 18px #10b981,
                31px 18px #065f46, 32px 18px #065f46, 33px 18px #065f46,
                34px 18px #065f46, 35px 18px #065f46, 36px 18px #10b981,
                21px 19px #10b981,
                28px 19px #10b981, 29px 19px #10b981, 30px 19px #10b981,
                31px 19px #065f46, 32px 19px #065f46, 33px 19px #065f46,
                34px 19px #065f46, 35px 19px #065f46, 36px 19px #10b981;
            }
            85.8% {
              box-shadow: 
                17px 14px #065f46, 18px 14px #065f46, 19px 14px #065f46, 35px 14px #10b981,
                17px 15px #065f46, 18px 15px #065f46, 19px 15px #065f46, 35px 15px #10b981,
                16px 16px #065f46, 17px 16px #065f46, 18px 16px #065f46, 19px 16px #065f46,
                20px 16px #065f46, 33px 16px #10b981, 34px 16px #10b981,
                35px 16px #065f46, 36px 16px #065f46, 37px 16px #10b981, 38px 16px #10b981,
                41px 16px #065f46, 42px 16px #065f46, 43px 16px #065f46;
            }
            100% {
              box-shadow: 
                31px 4px #10b981, 32px 4px #10b981, 33px 4px #10b981, 34px 4px #10b981, 35px 4px #10b981,
                31px 5px #10b981, 32px 5px #10b981, 33px 5px #10b981, 34px 5px #10b981, 35px 5px #10b981,
                21px 6px #10b981, 22px 6px #10b981, 23px 6px #10b981, 24px 6px #10b981,
                31px 6px #10b981, 32px 6px #10b981, 33px 6px #065f46, 34px 6px #065f46,
                35px 6px #065f46, 36px 6px #10b981, 37px 6px #10b981, 38px 6px #10b981,
                18px 7px #10b981, 19px 7px #10b981, 20px 7px #10b981,
                21px 7px #065f46, 22px 7px #065f46, 23px 7px #065f46, 24px 7px #10b981,
                32px 7px #10b981, 33px 7px #065f46, 34px 7px #065f46, 35px 7px #065f46,
                36px 7px #065f46, 37px 7px #065f46, 38px 7px #065f46, 39px 7px #10b981, 40px 7px #10b981;
            }
          }
        `
      }} />
    </div>
  );
}

// Compact version for smaller loading states
export function BatPixelLoaderMini({ className = "" }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="bat-mini" />
      <style dangerouslySetInnerHTML={{
        __html: `
          .bat-mini {
            width: 1px;
            height: 1px;
            transform: scale(2);
            position: relative;
            left: -16px;
            top: -16px;
            animation: bat-mini-fly 0.6s steps(1) infinite;
          }

          @keyframes bat-mini-fly {
            0% { box-shadow: 8px 2px #10b981, 9px 2px #10b981, 10px 2px #10b981, 8px 3px #10b981, 9px 3px #065f46, 10px 3px #10b981, 7px 4px #10b981, 8px 4px #065f46, 9px 4px #065f46, 10px 4px #065f46, 11px 4px #10b981; }
            33% { box-shadow: 6px 3px #10b981, 12px 3px #10b981, 7px 4px #10b981, 8px 4px #065f46, 9px 4px #065f46, 10px 4px #065f46, 11px 4px #10b981; }
            66% { box-shadow: 8px 1px #10b981, 9px 1px #10b981, 10px 1px #10b981, 8px 2px #10b981, 9px 2px #065f46, 10px 2px #10b981, 7px 3px #10b981, 8px 3px #065f46, 9px 3px #065f46, 10px 3px #065f46, 11px 3px #10b981; }
            100% { box-shadow: 8px 2px #10b981, 9px 2px #10b981, 10px 2px #10b981, 8px 3px #10b981, 9px 3px #065f46, 10px 3px #10b981, 7px 4px #10b981, 8px 4px #065f46, 9px 4px #065f46, 10px 4px #065f46, 11px 4px #10b981; }
          }
        `
      }} />
    </div>
  );
}
