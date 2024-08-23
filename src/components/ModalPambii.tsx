/* eslint-disable @next/next/no-img-element */
import React from 'react';
import classNames from 'classnames';
import { BadgePambii, ButtonPambii, CardPambii } from 'pambii-devtrader-front';
import Image from 'next/image';

type BadgeData = {
  icon: React.ReactNode;
  value?: number;
  textBadge?: string;
  name?: string;
};

type ButtonData = {
  text: string;
  bg: string;
  color: string;
  icon?: React.ReactNode;

  onClick: () => void;
};

type ModalData = {
  title: string;
  subtitle?: string;
  image?: string;
  badges?: BadgeData[];
  powerTitle?: string;
  powerBy?: any;
  description?: string;
  buttons?: ButtonData[];
  htmlButtom?: React.ReactNode;
  body?: React.ReactNode;
  bonus?: BadgeData[];
  onClose: () => void;
};

type ModalPambiiProps = {
  data: ModalData;
  className?: string;
};

const ModalPambii: React.FC<ModalPambiiProps> = ({ data, className }) => {
  const {
    title,
    subtitle,
    image,
    badges,
    powerTitle,
    powerBy,
    description,
    body,
    buttons,
    bonus,
    onClose,
    htmlButtom,
  } = data;
  console.log('data', data);

  return (
    <div
      className={classNames(
        'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[200]',
        className,
      )}
    >
      <div className="modal-container rounded-lg relative max-w-lg mx-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {bonus && (
                <div className="flex">
                  {bonus?.map((bonus, index) => (
                    <BadgePambii
                      key={index}
                      bg="#292929"
                      icon={bonus.icon}
                      number={bonus.value}
                      text={bonus?.textBadge}
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-col items-start">
                <h3 className="text-white text-sm font-bold">{title}</h3>
              </div>
            </div>
            <button onClick={onClose}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM6.96963 6.96965C7.26252 6.67676 7.73739 6.67676 8.03029 6.96965L9.99997 8.93933L11.9696 6.96967C12.2625 6.67678 12.7374 6.67678 13.0303 6.96967C13.3232 7.26256 13.3232 7.73744 13.0303 8.03033L11.0606 9.99999L13.0303 11.9696C13.3232 12.2625 13.3232 12.7374 13.0303 13.0303C12.7374 13.3232 12.2625 13.3232 11.9696 13.0303L9.99997 11.0607L8.03031 13.0303C7.73742 13.3232 7.26254 13.3232 6.96965 13.0303C6.67676 12.7374 6.67676 12.2625 6.96965 11.9697L8.93931 9.99999L6.96963 8.03031C6.67673 7.73742 6.67673 7.26254 6.96963 6.96965Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>

          {image && (
            <div className="">
              <CardPambii className="bg-gray-200 text-sm flex items-center justify-center">
                <img src={image} alt={title} className="w-32 h-32" />
              </CardPambii>
            </div>
          )}
          {powerBy && (
            <div className="flex flex-col items-start flex-grow mb-2">
              <div className="userinfocontainer">
                <Image
                  className="userinfocontainerChild boder-img"
                  alt="User"
                  src={powerBy?.image || 'Pambii-bee.web'}
                  width={50}
                  height={50}
                  placeholder="blur"
                  blurDataURL="/Pambii-bee.webp"
                />

                <span className="text-base">{'Item by:  '}</span>
                <div className="beenametext">{powerBy?.name}</div>
              </div>
            </div>
          )}
          {powerTitle && (
            <div className="flex flex-col items-start flex-grow">
              <h3 className=" font-bold mb-2">
                <span className="text-base">{'Attack name:  '}</span>
                <span className="text-red-500 ">{powerTitle}</span>
              </h3>
            </div>
          )}
          {subtitle && (
            <div className="flex flex-col items-start flex-grow">
              <p className="text-wrap text-left mb-2 text-sm font-normal font-['Poppins'] leading-[16px] tracking-tight">
                {subtitle}
              </p>
            </div>
          )}
          {body && (
            <div className="flex flex-col items-start flex-grow">{body}</div>
          )}

          {description && (
            <div className="flex flex-col items-start flex-grow">
              <h3 className=" font-bold mb-2 text-sm">Description:</h3>
              <p className="text-wrap text-left text-neutral-500 mb-4 text-sm font-normal font-['Poppins'] leading-[16px] tracking-tight">
                {description}
              </p>
            </div>
          )}

          {badges && (
            <div className="flex flex-wrap gap-2 w-full items-start break-words">
              {badges.map((badge: any, index) => (
                <BadgePambii
                  key={index}
                  icon={
                    <Image
                      src={
                        '/assets/bee-characters/icons/' + badge.name + '.svg'
                      }
                      alt={badge?.name}
                      width={20}
                      height={20}
                      id={index.toString()}
                    />
                  }
                  number={badge.value}
                  className="bg-border flex-grow badge"
                />
              ))}
            </div>
          )}
        </div>

        {htmlButtom && (
          <div className="flex justify-between space-x-4 mb-1 footer-modal p-4">
            {' '}
            {htmlButtom}{' '}
          </div>
        )}
        {buttons && (
          <div className="flex justify-between space-x-4 mb-1 footer-modal p-4">
            {buttons.map((button, index) => (
              <ButtonPambii
                key={index}
                bg={button.bg}
                color={button.color}
                icon={button.icon}
                onClick={button.onClick}
                className="w-full"
              >
                {button.text}
              </ButtonPambii>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalPambii;
