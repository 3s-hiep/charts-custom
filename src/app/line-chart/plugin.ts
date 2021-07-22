// <block:plugin:0>
const getOrCreateLegendList = (chart: any, id: any) => {
  const legendContainer = document.getElementById(id) as HTMLElement;
  let listContainer = legendContainer.querySelector("ul");
  if (!listContainer) {
    listContainer = document.createElement("ul");
    listContainer.style.display = "flex";
    listContainer.style.flexDirection = "row";
    listContainer.style.margin = "0";
    listContainer.style.padding = "0";
    legendContainer.appendChild(listContainer);
  }
  return listContainer;
};

export const htmlLegendPlugin = {
  id: "htmlLegend",
  afterUpdate(chart: any, args: any, options: any) {
    const ul = getOrCreateLegendList(chart, options.containerID);
    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }
    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach((item: any) => {
      const li = document.createElement("li");
      li.style.alignItems = "center";
      li.style.cursor = "pointer";
      li.style.display = "flex";
      li.style.flexDirection = "row";
      li.style.marginLeft = "10px";

      li.onclick = () => {
        const { type } = chart.config;
        if (type === "pie" || type === "doughnut") {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex,
            !chart.isDatasetVisible(item.datasetIndex)
          );
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement("cie-area-edit");
      // boxSpan.style.background = item.fillStyle;
      // boxSpan.style.borderColor = item.strokeStyle;
      // boxSpan.style.borderWidth = item.lineWidth + "px";
      // boxSpan.style.display = "inline-block";
      // boxSpan.style.height = "20px";
      // boxSpan.style.marginRight = "10px";
      // boxSpan.style.width = "20px";
      // boxSpan.style.borderRadius = "10px";

      // Text;
      // const textContainer = document.createElement("p");
      // textContainer.style.color = item.fontColor;
      // textContainer.style.margin = "0";
      // textContainer.style.padding = "0";
      // textContainer.style.textDecoration = item.hidden ? "line-through" : "";

      //const text = document.createTextNode(item.text);

      li.appendChild(boxSpan);
      //   li.appendChild(textContainer);
      ul.appendChild(li);
    });
  },
};

export const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.borderRadius = "3px";
    tooltipEl.style.color = "white";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";
    const table = document.createElement("table");
    table.style.margin = "0px";
    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export const externalTooltipHandler = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const tableBody = document.createElement("tooltip-component");
    tooltipEl.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding =
    tooltip.options.padding + "px " + tooltip.options.padding + "px";
};
