import React from 'react'
import '../static/custom.css'
import Header from '../Header'
import Body from '../Body'

type FieldOption<T = Record<string, unknown>> = {
  property: keyof T | 'children'
  displayName: string
  width?: number | string
  format?: (value: unknown) => React.ReactNode
}

type TreegridOptions<T = Record<string, unknown>> = {
  fields: Array<FieldOption<T>>
}

type TreegridProps<T = Record<string, unknown>> = {
  data: T[]
  options: TreegridOptions<T>
  loading?: boolean
}

const Treegrid = <T extends Record<string, unknown>>({
  data,
  options,
  loading = false,
}: TreegridProps<T>) => {
  if (loading) {
    return <div />
  }

  return (
    <div>
      <table className="table table-striped table-hover">
        <Header options={options} />
        <Body data={data} options={options} />
      </table>
    </div>
  )
}

export default Treegrid
