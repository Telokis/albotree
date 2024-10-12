import { btJsx } from "./BehaviorTree/btJsx";
import { Fallback } from "./BehaviorTree/nodes/Fallback";
import { MoveTo } from "./ALNodes/MoveTo";
import { IsMonsterNearby } from "./ALNodes/predicates/IsMonsterNearby";
import { Sequence } from "./BehaviorTree/nodes/Sequence";
import { IsAlive } from "./ALNodes/predicates/IsAlive";
import { Respawn } from "./ALNodes/Respawn";
import { ThrottleDecorator } from "./BehaviorTree/nodes/decorators/ThrottleDecorator";
import { AcquireTargets } from "./ALNodes/AcquireTargets";
import { IsInRange } from "./ALNodes/predicates/IsInRange";
import { MoveInRange } from "./ALNodes/MoveInRange";
import { IsSkillUsable } from "./ALNodes/predicates/IsSkillUsable";
import { BasicAttack } from "./ALNodes/BasicAttack";
import { MermaidGraphVisitor } from "./BehaviorTree/visitors/MermaidGraphVisitor";
import { HasPotions } from "./ALNodes/predicates/HasPotions";
import { IsOnCooldown } from "./ALNodes/predicates/IsOnCooldown";
import { DrinkPotion } from "./ALNodes/DrinkPotion";
import { LootChests } from "./ALNodes/LootChests";

const mobTarget = "crab";

const PotionHandling = () => (
  <Sequence comment="Potion handling (Buy and consume)">
    <HasPotions />
    <Fallback comment="Ensure potions are consumed as needed">
      <IsOnCooldown spellName="use_hp" />
      <DrinkPotion />
    </Fallback>
  </Sequence>
);

const EnsureTargetNearby = () => (
  <Fallback comment="Ensure mob nearby">
    <IsMonsterNearby mobTypes={mobTarget} />
    <MoveTo destinationOrKey={mobTarget} />
  </Fallback>
);

const EnsureAlive = () => (
  <Fallback comment="Ensure char alive">
    <IsAlive />
    <ThrottleDecorator delay={1500}>
      <Respawn />
    </ThrottleDecorator>
  </Fallback>
);

const EnsureTargetInRange = () => (
  <Sequence comment="Ensure target in range">
    <EnsureTargetNearby />
    <ThrottleDecorator delay={150}>
      <AcquireTargets
        criteria={{
          type: mobTarget,
          couldGiveCredit: true,
          canDamage: true,
          willDieToProjectiles: false,
        }}
        BBKey="key:targets"
      />
    </ThrottleDecorator>
    <Fallback comment="Ensure in range">
      <IsInRange BBKey="key:targets" />
      <MoveInRange BBKey="key:targets" />
    </Fallback>
  </Sequence>
);

const AttackIfPossible = () => (
  <Sequence comment="Attack">
    <IsSkillUsable spellName="attack" />
    <BasicAttack BBKey="key:targets" randomize />
  </Sequence>
);

const behaviorTree = (
  <Sequence comment="Main loop">
    <EnsureAlive />
    <LootChests />
    <PotionHandling />
    <EnsureTargetInRange />
    <AttackIfPossible />
  </Sequence>
);

const mermaidVisitor = new MermaidGraphVisitor();

behaviorTree.accept(mermaidVisitor);

console.log("Generated Mermaid Graph:");
console.log(mermaidVisitor.getGraph());

export { behaviorTree };
