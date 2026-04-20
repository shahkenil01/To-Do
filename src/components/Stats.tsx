import React from 'react';

type Props = {
  total: number;
  completed: number;
};
 
export default function Stats({ total, completed }: Props) {
  const active = total - completed;
  return (
    <div className="stats">
      <span>Total: {total}</span>
      <span>Active: {active}</span>
      <span>Completed: {completed}</span>
    </div>
  );
}
