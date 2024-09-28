import { FunctionComponent } from 'react';
import styles from './SelectBeeContainer.module.css';
import Bee from '../Bee';
import UserComponent from '../UserComponent';

interface SelectBeeContainerProps {
  dataUser1: any;
  dataUser2: any; // Define the type for dataUser2 as needed
  userId2: any;
  userId1: any;
}

const SelectBeeContainer: FunctionComponent<SelectBeeContainerProps> = ({
  dataUser1,
  dataUser2,
  userId1,
  userId2,
}) => {
  return (
    <div className={styles.selectbeecontainer}>
      <div className="flex flex-row flex-nowrap w-full">
        <div>
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
          <div className="text-center">
            {' '}
            <div className="name-battle">
              <UserComponent userId2={userId2} />
            </div>
          </div>
        </div>
        <div>
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
          <div className="center">
            {' '}
            <div className="name-battle">
              <UserComponent userId2={userId1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectBeeContainer;
