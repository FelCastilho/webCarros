import { ReactNode } from "react"
//Componente responsavel por adicionar um container com todo o conteudo dentro do layout da home
export function Container({children} : {children: ReactNode}){
    return(
        <div className="w-full max-w-7xl mx-auto px-4">
            {children}
        </div>
    )
}