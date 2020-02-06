import React from "react"
import c3 from "billboard.js"
import "billboard.js/dist/billboard.min.css"
import "./Chart.css"
class Chart extends React.Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return nextProps !== this.props
  }
  refreshChart() {
    if (this.chart) this.chart.destroy()
    this.chart = c3.generate({
      ...this.props,
      bindto: this.container,
    })
  }
  componentDidUpdate() {
    this.refreshChart()
  }
  componentDidMount() {
    this.refreshChart()
  }
  render() {
    return <div ref={el => (this.container = el)}></div>
  }
}
export default Chart
