import Image from 'next/image';
import React from 'react';

// Definimos el tipo para las habilidades
type Ability = {
  id: number;
  name: string;
  icon: React.ReactNode;
  Parts: string;
};

// Definimos las props del componente
interface AbilitiesComponentProps {
  abilities: Ability[];
}

// Componente AbilityBadge
const AbilityBadge: React.FC<{ ability: Ability }> = ({ ability }) => {
  console.log('ability', ability);
  ability.icon = ability?.Parts.toLowerCase();
  return (
    <div className="badge-new">
      <span className="bold-essentional-ui-sledg">
        <Image
          src={'/assets/bee-characters/icons/' + ability.icon + '.svg'}
          alt="Select arena"
          width={24}
          height={24}
        />
      </span>
      <div className="badgetext-text">{ability.name}</div>
    </div>
  );
};

// Componente principal AbilitiesPambii
const AbilitiesPambii: React.FC<AbilitiesComponentProps> = ({ abilities }) => {
  // Divide las habilidades en filas dependiendo de la cantidad
  const groupedAbilities = (abilities: Ability[]) => {
    switch (abilities.length) {
      case 1:
        return [abilities];
      case 2:
        return [abilities];
      case 3:
        return [[abilities[0], abilities[1]], [abilities[2]]];
      case 4:
        return [
          [abilities[0], abilities[1]],
          [abilities[2], abilities[3]],
        ];
      default:
        return [
          [abilities[0], abilities[1]],
          [abilities[2], abilities[3]],
          [abilities[4]],
        ];
    }
  };

  const rows = groupedAbilities(abilities);

  return (
    <div className="abilitiescontainer">
      <div className="text-badge">Abilities of this bee:</div>
      <div className="abilitiescontainer1">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`abilities ${row.length === 1 ? 'abilities2' : ''}`}
          >
            {row.map((ability) => (
              <AbilityBadge key={ability.id} ability={ability} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbilitiesPambii;
