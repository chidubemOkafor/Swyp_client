import { ButtonHTMLAttributes, HTMLAttributes } from "react"

const Button = ({ variant = "primary",children, disabled = false, isVariantSub = false, ...props}: { variant?: "secondary" | "primary", children: React.ReactNode, disabled?: boolean, isVariantSub?: boolean }) => {
    let color = "cursor-pointer  bg-amber-400 hover:bg-amber-400/80"
    let activeColor = "cursor-progress bg-amber-400/30"
    let variantSub = "cursor-pointer bg-purple-800 hover:bg-purple-800/90"
    
    if (variant === "secondary") {
        color = "cursor-pointer  bg-amber-600"
        activeColor = "cursor-progress bg-amber-600/30"
        variantSub = "cursor-pointer bg-purple-800 hover:bg-purple-800/90"
    }

    return (
        <button className={`rounded-md flex items-center justify-center gap-3 font-bold text-black px-5 py-3 ${color} ${disabled && activeColor} ${isVariantSub && variantSub}`} {...props} >
            {children}
        </button>
    )
}
export default Button