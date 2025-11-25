import { cn } from "@/lib/utils"
import styles from "./PegasusSignature.module.css"

type PegasusSignatureProps = {
  className?: string
  variant?: 'default' | 'white'
}

export const PegasusSignature = ({ className, variant = 'default' }: PegasusSignatureProps) => {
  return (
    <span className={cn(styles.wrapper, className)}>
      <span aria-hidden="true" className={styles.divider} />
      <span 
        className={styles.label}
        style={variant === 'white' ? { color: '#ffffff' } : undefined}
      >
        Pegasus
      </span>
    </span>
  )
}

export default PegasusSignature

