import React from 'react';

export function BatLoader({ size = 4, speed = 0.4, className = "" }) {
  const scaleStyle = {
    transform: `scale(${size})`,
    animationDuration: `${speed}s`
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="bat-pixel-loader"
        style={scaleStyle}
      />
      <style jsx>{`
        .bat-pixel-loader {
          width: 1px;
          height: 1px;
          position: relative;
          left: -128px;
          top: -128px;
          animation: bat steps(1) infinite;
        }

        @keyframes bat {
          0% {
            box-shadow: 33px 6px #54556b, 34px 6px #54556b, 35px 6px #54556b, 36px 6px #54556b, 20px 7px #54556b, 21px 7px #54556b, 22px 7px #54556b, 23px 7px #54556b, 33px 7px #54556b, 34px 7px #54556b, 35px 7px #202020, 36px 7px #202020, 37px 7px #54556b, 38px 7px #54556b, 39px 7px #54556b, 43px 7px #54556b, 20px 8px #54556b, 21px 8px #54556b, 22px 8px #54556b, 23px 8px #54556b, 33px 8px #54556b, 34px 8px #54556b, 35px 8px #202020, 36px 8px #202020, 37px 8px #54556b, 38px 8px #54556b, 39px 8px #54556b, 43px 8px #54556b, 17px 9px #54556b, 18px 9px #54556b, 19px 9px #54556b, 20px 9px #54556b, 35px 9px #54556b, 36px 9px #202020, 37px 9px #202020, 38px 9px #202020, 39px 9px #202020, 40px 9px #54556b, 41px 9px #54556b, 42px 9px #54556b, 43px 9px #202020, 44px 9px #54556b, 45px 9px #54556b, 16px 10px #54556b, 17px 10px #202020, 18px 10px #202020, 19px 10px #202020, 20px 10px #54556b, 36px 10px #54556b, 37px 10px #202020, 38px 10px #202020, 39px 10px #202020, 40px 10px #202020, 41px 10px #202020, 42px 10px #202020, 43px 10px #202020, 44px 10px #54556b, 45px 10px #54556b, 16px 11px #54556b, 17px 11px #202020, 18px 11px #202020, 19px 11px #202020, 20px 11px #54556b, 36px 11px #54556b, 37px 11px #202020, 38px 11px #202020, 39px 11px #202020, 40px 11px #202020, 41px 11px #202020, 42px 11px #202020, 43px 11px #202020, 44px 11px #54556b, 45px 11px #54556b, 13px 12px #54556b, 14px 12px #54556b, 15px 12px #54556b, 16px 12px #202020, 17px 12px #202020, 18px 12px #54556b, 19px 12px #54556b, 20px 12px #54556b, 36px 12px #54556b, 37px 12px #54556b, 38px 12px #54556b, 39px 12px #202020, 40px 12px #202020, 41px 12px #202020, 42px 12px #202020, 43px 12px #202020, 44px 12px #54556b, 45px 12px #54556b;
          }
          14.3% {
            box-shadow: 17px 7px #54556b, 37px 7px #54556b, 38px 7px #54556b, 17px 8px #54556b, 37px 8px #54556b, 38px 8px #54556b, 16px 9px #54556b, 17px 9px #202020, 18px 9px #54556b, 19px 9px #54556b, 36px 9px #54556b, 37px 9px #202020, 38px 9px #202020, 39px 9px #54556b, 43px 9px #54556b, 44px 9px #54556b, 45px 9px #54556b, 14px 10px #54556b, 15px 10px #54556b, 16px 10px #202020, 17px 10px #54556b, 37px 10px #54556b, 38px 10px #54556b, 39px 10px #202020, 40px 10px #54556b, 43px 10px #54556b, 44px 10px #202020, 45px 10px #202020, 46px 10px #54556b, 14px 11px #54556b, 15px 11px #54556b, 16px 11px #202020, 17px 11px #54556b, 37px 11px #54556b, 38px 11px #54556b, 39px 11px #202020, 40px 11px #54556b, 43px 11px #54556b, 44px 11px #202020, 45px 11px #202020, 46px 11px #54556b, 10px 12px #54556b, 11px 12px #54556b, 13px 12px #54556b, 14px 12px #202020, 15px 12px #202020, 16px 12px #202020, 17px 12px #54556b, 37px 12px #54556b, 38px 12px #54556b, 39px 12px #202020, 40px 12px #202020, 41px 12px #54556b, 42px 12px #54556b, 43px 12px #54556b, 44px 12px #202020, 45px 12px #202020, 46px 12px #202020, 47px 12px #54556b;
          }
          28.6% {
            box-shadow: 16px 12px #202020, 17px 12px #202020, 16px 13px #202020, 17px 13px #202020, 16px 14px #202020, 17px 14px #202020, 43px 14px #202020, 44px 14px #202020, 45px 14px #202020, 16px 15px #202020, 17px 15px #202020, 43px 15px #202020, 44px 15px #202020, 45px 15px #202020, 12px 16px #202020, 13px 16px #202020, 43px 16px #202020, 44px 16px #202020, 45px 16px #202020, 12px 17px #202020, 13px 17px #202020;
          }
          42.9% {
            box-shadow: 47px 14px #202020, 47px 15px #202020, 14px 16px #202020, 15px 16px #202020, 28px 20px #54556b, 29px 20px #54556b, 30px 20px #54556b, 48px 20px #202020, 49px 20px #202020, 9px 21px #202020, 18px 21px #54556b, 19px 21px #54556b, 20px 21px #54556b, 21px 21px #54556b, 22px 21px #54556b, 23px 21px #54556b, 27px 21px #54556b, 28px 21px #202020, 29px 21px #54556b, 30px 21px #54556b;
          }
          57.2% {
            box-shadow: 31px 16px #54556b, 32px 16px #54556b, 31px 17px #54556b, 32px 17px #54556b, 20px 18px #54556b, 21px 18px #54556b, 28px 18px #54556b, 29px 18px #54556b, 30px 18px #54556b, 31px 18px #202020, 32px 18px #202020, 33px 18px #54556b, 34px 18px #54556b, 20px 19px #54556b, 21px 19px #54556b, 28px 19px #54556b, 29px 19px #54556b, 30px 19px #54556b, 31px 19px #202020, 32px 19px #202020, 33px 19px #54556b, 34px 19px #54556b;
          }
          71.5% {
            box-shadow: 32px 15px #54556b, 33px 15px #54556b, 34px 15px #54556b, 32px 16px #54556b, 33px 16px #54556b, 34px 16px #54556b, 31px 17px #54556b, 32px 17px #202020, 33px 17px #202020, 34px 17px #202020, 35px 17px #54556b, 21px 18px #54556b, 28px 18px #54556b, 29px 18px #54556b, 30px 18px #54556b, 31px 18px #202020, 32px 18px #202020, 33px 18px #202020, 34px 18px #202020, 35px 18px #202020, 36px 18px #54556b;
          }
          85.8% {
            box-shadow: 17px 14px #202020, 18px 14px #202020, 19px 14px #202020, 35px 14px #54556b, 17px 15px #202020, 18px 15px #202020, 19px 15px #202020, 35px 15px #54556b, 16px 16px #202020, 17px 16px #202020, 18px 16px #202020, 19px 16px #202020, 20px 16px #202020, 33px 16px #54556b, 34px 16px #54556b, 35px 16px #202020, 36px 16px #202020, 37px 16px #54556b, 38px 16px #54556b;
          }
          100% {
            box-shadow: 31px 4px #54556b, 32px 4px #54556b, 33px 4px #54556b, 34px 4px #54556b, 35px 4px #54556b, 31px 5px #54556b, 32px 5px #54556b, 33px 5px #54556b, 34px 5px #54556b, 35px 5px #54556b, 21px 6px #54556b, 22px 6px #54556b, 23px 6px #54556b, 24px 6px #54556b, 31px 6px #54556b, 32px 6px #54556b, 33px 6px #202020, 34px 6px #202020, 35px 6px #202020, 36px 6px #54556b, 37px 6px #54556b, 38px 6px #54556b;
          }
        }
      `}</style>
    </div>
  );
}

// Alternative version using Tailwind classes for better integration
export function BatLoaderTailwind({ size = 4, speed = 0.4, className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="bat-loader"
        style={{
          transform: `scale(${size})`,
          animationDuration: `${speed}s`
        }}
      />
      <style jsx>{`
        .bat-loader {
          width: 1px;
          height: 1px;
          position: relative;
          left: -128px;
          top: -128px;
          animation: bat-fly steps(1) infinite;
        }

        @keyframes bat-fly {
          0% { box-shadow: 33px 6px #54556b, 34px 6px #54556b, 35px 6px #54556b, 36px 6px #54556b, 20px 7px #54556b, 21px 7px #54556b, 22px 7px #54556b, 23px 7px #54556b, 33px 7px #54556b, 34px 7px #54556b, 35px 7px #202020, 36px 7px #202020, 37px 7px #54556b, 38px 7px #54556b, 39px 7px #54556b, 43px 7px #54556b; }
          14.3% { box-shadow: 17px 7px #54556b, 37px 7px #54556b, 38px 7px #54556b, 17px 8px #54556b, 37px 8px #54556b, 38px 8px #54556b, 16px 9px #54556b, 17px 9px #202020, 18px 9px #54556b, 19px 9px #54556b, 36px 9px #54556b, 37px 9px #202020, 38px 9px #202020, 39px 9px #54556b; }
          28.6% { box-shadow: 16px 12px #202020, 17px 12px #202020, 16px 13px #202020, 17px 13px #202020, 16px 14px #202020, 17px 14px #202020, 43px 14px #202020, 44px 14px #202020, 45px 14px #202020; }
          42.9% { box-shadow: 28px 20px #54556b, 29px 20px #54556b, 30px 20px #54556b, 18px 21px #54556b, 19px 21px #54556b, 20px 21px #54556b, 21px 21px #54556b, 22px 21px #54556b, 23px 21px #54556b, 27px 21px #54556b; }
          57.2% { box-shadow: 31px 16px #54556b, 32px 16px #54556b, 31px 17px #54556b, 32px 17px #54556b, 20px 18px #54556b, 21px 18px #54556b, 28px 18px #54556b, 29px 18px #54556b, 30px 18px #54556b; }
          71.5% { box-shadow: 32px 15px #54556b, 33px 15px #54556b, 34px 15px #54556b, 32px 16px #54556b, 33px 16px #54556b, 34px 16px #54556b, 31px 17px #54556b, 32px 17px #202020, 33px 17px #202020; }
          85.8% { box-shadow: 17px 14px #202020, 18px 14px #202020, 19px 14px #202020, 35px 14px #54556b, 17px 15px #202020, 18px 15px #202020, 19px 15px #202020, 35px 15px #54556b; }
          100% { box-shadow: 31px 4px #54556b, 32px 4px #54556b, 33px 4px #54556b, 34px 4px #54556b, 35px 4px #54556b, 31px 5px #54556b, 32px 5px #54556b, 33px 5px #54556b, 34px 5px #54556b, 35px 5px #54556b; }
        }
      `}</style>
    </div>
  );
}
