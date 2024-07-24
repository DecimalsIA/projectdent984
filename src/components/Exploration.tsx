import React from 'react';

interface Badge {
  Icon?: JSX.Element;
  text?: string;
  value?: string;
}

interface ExplorationInfoProps {
  badges: Badge[];
}

const ExplorationInfo: React.FC<ExplorationInfoProps> = ({ badges }) => {
  return (
    <div className="explorationContainer">
      <div className="explorationText">Exploration info:</div>
      <div className="explorationContainer1">
        <div className="explorationAbilities">
          {badges.map((badge, index) => (
            <div key={index} className="explorationBadgeMinibuttonTooltip">
              <div className="explorationAchievementContainer">
                {badge.Icon &&
                  React.cloneElement(badge.Icon, {
                    className: 'explorationBoldIcon',
                  })}
                <div className="explorationBadgeText">{badge.text}</div>
              </div>
              <div className="explorationBadgeText1">{badge.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorationInfo;
