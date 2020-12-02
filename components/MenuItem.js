import { useState } from 'react'
import styled from 'styled-components'
import formatCost from '../utils/formatCost'
import OrderItem from '../components/OrderItem'

const ItemContainer = styled.div`
    padding: 12px;
    border: 1px solid rgb(255, 205, 41);
    border-radius: 3px;
    font-size: 16px;
    margin: 10px 0;
    background-color: white;
`
const ItemInfoContainer = styled.div`
    display: grid;
    grid-template-columns: 200px 3fr;
    column-gap: 12px;   
    @media (max-width: 500px) {
        grid-template-columns: 1fr;    
    }
`
const ItemImage = styled.img`
    width: 100%;
`
const ItemTextContainer = styled.div`
    position: relative;
`
const ItemTitle = styled.p`
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5em;
    color: rgb(255, 112, 110);
    display: inline-block;
    border-radius: 5px;
    margin: 0 0 5px 0;
`
const AddToOrderButton = styled.button`
    display: block;
    position: absolute;
    bottom: 0;
    right: 0;
    @media (max-width: 500px) {
        margin-top: 1em;   
        position: relative;
    }
`
// const ItemOption = styled.p`
//     font-size: .9em;
//     &::before {
//         content: '🍔 ';
//     }
// `

export default function MenuItem({ item }) {
    // console.log('item: ', item)
    const [itemEditorIsOpen, setItemEditorIsOpen] = useState(false)

    function handleEditorToggleClick() {
        setItemEditorIsOpen(itemEditorIsOpen ? false : true)
    }

    return (
        <ItemContainer>
            <ItemInfoContainer>
                <ItemImage 
                    src='/burger_angels_1.jpg'
                    alt={`placeholder image for ${item.name}`}
                    width="200"
                />

                <ItemTextContainer>
                    <ItemTitle>{item.name}</ItemTitle>
                    <p>{item.description}</p>
                    <p>{formatCost(item.cost)}</p>
                    {item.options && 
                        item.options.map((option, i) => {
                            return (
                                <ItemOption key={i}>
                                    {option}
                                </ItemOption>
                            )
                        })
                    }
                    {!itemEditorIsOpen && (
                        <AddToOrderButton onClick={handleEditorToggleClick}>
                            Order
                        </AddToOrderButton>
                    )}
                </ItemTextContainer>
            </ItemInfoContainer>       

            {itemEditorIsOpen && (
                <OrderItem 
                    item={item} 
                    itemEditorIsOpen={itemEditorIsOpen}
                    handleEditorToggleClick={handleEditorToggleClick}
                />
            )}
            
            
        </ItemContainer>
    )
}