import { VictoryLine, VictoryChart, VictoryTheme } from "victory";

export default function MiniChart({ data, color }) {
  return (
    <VictoryChart
      height={120}
      padding={{ top: 15, bottom: 25, left: 35, right: 10 }}
      theme={VictoryTheme.material}
    >
      <VictoryLine
        data={data}
        x="fecha"
        y="valor"
        style={{
          data: {
            stroke: color,
            strokeWidth: 3,
          },
        }}
      />
    </VictoryChart>
  );
}
