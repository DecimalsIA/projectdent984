import { FunctionComponent } from 'react';
import styles from './SelectBeeContainer.module.css';
import Bee from '../Bee';
import UserComponent from '../UserComponent';
import LevelBar from './LevelBar';

interface SelectBeeContainerProps {
  dataUser1: any;
  dataUser2: any; // Define the type for dataUser2 as needed
  userId2: any;
  userId1: any;
  battleIfoUser1: any;
  battleIfoUser2: any;
  battleIfoUser1Number: any;
  battleIfoUser2Number: any;
  life1: any;
  life2: any;
}

const SelectBeeContainer: FunctionComponent<SelectBeeContainerProps> = ({
  dataUser1,
  dataUser2,
  userId1,
  userId2,
  battleIfoUser1,
  battleIfoUser2,
  battleIfoUser1Number,
  battleIfoUser2Number,
  life1,
  life2,
}) => {
  return (
    <div className={styles.selectbeecontainer}>
      <div className="flex flex-row flex-nowrap w-full">
        <div>
          <div className="typeAbi">
            {' '}
            <span
              className={battleIfoUser1 === 'defense' ? 'defense' : 'attak'}
            >
              {battleIfoUser1 !== '' && battleIfoUser1}
            </span>
            <span
              className={battleIfoUser1 === 'defense' ? 'defense' : 'attak'}
            >
              {battleIfoUser1Number !== 0 && '+ ' + battleIfoUser1Number}
            </span>
          </div>
          <div className="text-center">
            {' '}
            <div className="name-battle">
              <LevelBar
                name={<UserComponent userId2={userId1} />}
                init={life1}
                life={life1}
              />
            </div>
          </div>
          <div className="battle-bee h-56">
            <Bee
              basePathW={dataUser1?.['wings']?.typePart?.toLowerCase() || ''}
              basePathH={dataUser1?.['head']?.typePart?.toLowerCase() || ''}
              basePathF={
                dataUser1?.['frontLegs']?.typePart?.toLowerCase() || ''
              }
              basePathHi={
                dataUser1?.['hindLegs']?.typePart?.toLowerCase() || ''
              }
              basePathSt={dataUser1?.['stinger']?.typePart?.toLowerCase() || ''}
              basePathT={dataUser1?.['torso']?.typePart?.toLowerCase() || ''}
              classSes="bee-battle-be"
            />
          </div>
        </div>
        <div>
          <div className="typeAbi">
            <span
              className={battleIfoUser2 === 'defense' ? 'defense' : 'attak'}
            >
              {battleIfoUser2 !== '' && battleIfoUser2}
            </span>

            <span
              className={battleIfoUser2 === 'defense' ? 'defense' : 'attak'}
            >
              {battleIfoUser2Number !== 0 && '+ ' + battleIfoUser2Number}
            </span>
          </div>
          <div className="center">
            {' '}
            <div className="name-battle">
              <LevelBar
                name={<UserComponent userId2={userId2} />}
                classe="battle-bee-bar"
                init={life2}
                life={life2}
              />
            </div>
          </div>
          <div className="battle-bee-thow h-56">
            <Bee
              basePathW={dataUser2?.['wings']?.typePart?.toLowerCase() || ''}
              basePathH={dataUser2?.['head']?.typePart?.toLowerCase() || ''}
              basePathF={
                dataUser2?.['frontLegs']?.typePart?.toLowerCase() || ''
              }
              basePathHi={
                dataUser2?.['hindLegs']?.typePart?.toLowerCase() || ''
              }
              basePathSt={dataUser2?.['stinger']?.typePart?.toLowerCase() || ''}
              basePathT={dataUser2?.['torso']?.typePart?.toLowerCase() || ''}
              classSes="bee-battle-be"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectBeeContainer;
