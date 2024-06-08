import { FC, ReactElement } from 'react'
import { Callout as Cl } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'

type TCallout = Cl.RootProps & {
  text: string | ReactElement
}

export const Callout: FC<TCallout> = ({ text, variant, color, size }) => {
  const { Icon, Root, Text } = Cl

  return (
    <Root variant={variant} color={color} size={size}>
      <Icon>
        <InfoCircledIcon />
      </Icon>
      <Text>{text}</Text>
    </Root>
  )
}
