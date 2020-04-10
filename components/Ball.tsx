import classnames from 'classnames'
import React from 'react'

interface Props {
  animate?: boolean
  color: string
  number: number
  size?: number
}

export default function Ball({
  animate = false,
  color,
  number,
  size = 90,
}: Props) {
  return (
    <div className={classnames(['text-center', animate && 'appear'])}>
      <div
        className={classnames([
          'ball',
          color === 'blue' && 'bg-blue-600',
          color === 'green' && 'bg-green-600',
          color === 'red' && 'bg-red-600',
          color === 'yellow' && 'bg-yellow-600',
        ])}
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        <div>
          <span className="font-medium" style={{ fontSize: `${size / 3}px` }}>
            {number}
          </span>
        </div>
      </div>
    </div>
  )
}
