import React from "react"
import Chart from "@components/atoms/Chart"
import groupBy from "lodash/groupBy"
import keyBy from "lodash/keyBy"
import pipe from "lodash/fp/pipe"
import map from "lodash/fp/map"
import uniq from "lodash/uniq"
import Select from "react-select"

const getUniqueLocations = pipe(map("location"), uniq)

const immdTypes = ["arrival", "departure"]
const sourceType = ["mainland", "hong_kong", "other", "total"]
const immdOptions = immdTypes.map(str => ({ value: str, label: str }))
const sourceTypeOptions = sourceType.map(str => ({ value: str, label: str }))

export class ImmdChart extends React.Component {
  constructor() {
    super()
    this.state = {
      immdType: "arrival",
      sourceType: "mainland",
    }
  }
  render() {
    const dataByDate = groupBy(this.props.data, "date")
    const locations = getUniqueLocations(this.props.data)
    const dataKeyByDateLocation = keyBy(
      this.props.data,
      i => `${i.date}-${i.location}`
    )
    const dates = Object.keys(dataByDate).sort()
    const columnsByLocation = locations.map(location => [
      location,
      ...dates.map(
        date =>
          dataKeyByDateLocation[`${date}-${location}`][
            `${this.state.immdType}_${this.state.sourceType}`
          ]
      ),
    ])
    const data = {
      x: "dates",
      type: "area",
      types: {
        Total: "line",
      },
      names: {},
      columns: [["dates", ...dates], ...columnsByLocation],
      groups: [locations],
    }

    return (
      <>
        <Select
          options={immdOptions}
          value={immdOptions.find(i => i.value === this.state.immdType)}
          onChange={({ value: immdType }) => this.setState({ immdType })}
        />
        <Select
          options={sourceTypeOptions}
          value={sourceTypeOptions.find(
            i => i.value === this.state.sourceType
          )}
          onChange={({ value: sourceType }) => this.setState({ sourceType })}
        />
        <Chart
          data={data}
          axis={{
            x: {
              type: "timeseries",
              tick: {
                format: "%m-%d",
              },
            },
            y: {
              tick: {
                text: { show: false },
              },
            },
          }}
        />
      </>
    )
  }
}
