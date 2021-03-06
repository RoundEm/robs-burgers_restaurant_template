import { useEffect, useState } from 'react'
import sanity from '../lib/sanity'
import styled, { keyframes } from 'styled-components'
import Layout from '../components/Layout'
import MenuItem from '../components/MenuItem'
import MenuItemOfDayModal from '../components/MenuItemOfDayModal'
import OrderItemModal from '../components/OrderItemModal'

const MenuItemsContainer = styled.div`
    background-color: rgb(255, 205, 41);
    padding: 10px;
    min-width: 370px;
`
const MenusUl = styled.ul`
    display: flex;
    justify-content: center;
`
const MenuLi = styled.li`
    display: flex;
    align-items: stretch;
    padding: 5px;
    border-radius: 3px 3px 0 0;
    background: linear-gradient(rgb(255, 147, 145), rgb(255, 112, 110));
    ${({ active }) => active && `
        background: linear-gradient(
            rgb(255, 233, 161), 
            rgb(255, 225, 125), 
            rgb(255, 222, 115), 
            rgb(255, 205, 41)
        );
        font-weight: 500;
    `}
    &:hover {
        color: rgb(255, 205, 41);
        cursor: pointer;
    }
    
`
const MenuTitle = styled.span`
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3em;
    font-weight: 400;
    text-align: center;
    display: inline-block;
    padding: 10px;
    background-color: rgb(219, 21, 18);
    color: white;
    border-radius: 3px;
    &:hover {
        color: rgb(255, 205, 41);
        cursor: pointer;
    }
    ${({ active }) => active && `
        color: rgb(255, 225, 125);
    `}
    @media (max-width: 750px) {
        font-size: 1.1em;
    } 
`
const BtnContainer = styled.div`
    text-align: center; 
`
const BurgerOfDayBtn = styled.button`
    margin-bottom: 1em;
`
const SnackbarContainer = styled.div`
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 20px 40px 10px;
`
const slideFade = keyframes`
    0% {
        opacity: 0;
        transform: translateY(70%);
    }
    100% {
        opacity: 1;
        transform: translateY(0%);
        
    }
`
// TODO: add animation and tweak colors
const AddOrderItemSuccessSnackbar = styled.div`
    animation: ${slideFade} 100ms linear;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 1.2em;
    background: rgb(255, 233, 161);
    /* background: rgb(169, 218, 242); */
    border: 1px solid rgb(122, 170, 194);
    border-radius: 3px;
    box-shadow: 0 0 10px black;
`

const itemOfDayQuery = `*[ 
    _type == "menu_item" && 
    menu_item_of_day_eligible == true 
] {
    _id,
    name,
  	description,
  	cost,
  	add_ons[]->,
    options[]->
}` 

export default function Order(props) {
     const [allMenusAndItems, setAllMenusAndItems] = useState(props.menus)
    // TODO: add `default` menu boolean setting in sanity? 
    const [selectedMenu, setSelectedMenu] = useState(function() {
        const [ defaultMenu ] = allMenusAndItems.filter(menu => {
            return menu.name === 'Basic Burgers'
        })
        return defaultMenu
    })
    const [orderItemModalIsOpen, setOrderItemModalIsOpen] = useState(false)
    const [activeMenuItem, setActiveMenuItem] = useState(null)
    const [showNoQuantityError, setShowNoQuantityError] = useState(false)
    const [showNoOptionError, setShowNoOptionError] = useState(false)
    const [itemOfDay, setItemOfDay] = useState({})
    const [itemOfDayIsActive, setItemOfDayIsActive] = useState(false)
    const [addToOrderSuccessSnackbarIsActive, setAddToOrderSuccessSnackbarIsActive] = useState(false)
    const ITEM_OF_DAY_DISCOUNT = 1.5

    useEffect(() => {
        // TODO: use caching to calculate this once per day and use previously calculated value instead of re-fetching
        sanity.fetch(itemOfDayQuery)
            .then(data =>  {
                setItemOfDay(data[Math.floor(Math.random() * data.length)]) 
            })
            .catch(err => console.log('error fetching eligible menu items of the day: ', err))
    }, [])

    useEffect(() => {
        let timerID 
        if (addToOrderSuccessSnackbarIsActive) {
            setAddToOrderSuccessSnackbarIsActive(true)
            timerID = setTimeout(() => {
                setAddToOrderSuccessSnackbarIsActive(false)
            }, 2500)
        }
        return () => clearTimeout(timerID)
    })
    
    function handleModalBtnClick(item) {
        // console.log('handleModalBtnClick item: ', item)
        if (item) {
            if (item === 'item-of-day') {
                setItemOfDayIsActive(true)
            } else {
                setActiveMenuItem(item)
                setOrderItemModalIsOpen(true)
                setItemOfDayIsActive(false)
            }
            document.addEventListener('click', handleModalClose)
        } else {
            // TODO: move these state resetters to a `clearModalState` function so that the handler for ESC closing modal can always refer to a function with the same name?
            setOrderItemModalIsOpen(false)
            setActiveMenuItem(null)
            setItemOfDayIsActive(false)
            setShowNoQuantityError(false)
            setShowNoOptionError(false)
            document.removeEventListener('click', handleModalClose)
        }
    }

    function handleModalClose(e) {
        if (e.target.id === 'modal-container' || 
            [...e.target.classList].includes('close-modal-btn')
        ) { 
            handleModalBtnClick(null) 
        }
    }

    function handleMenuSelection(e) {
        const menuId = e.target.id
        const [ selectedMenu ] = allMenusAndItems.filter(menu => {
            return menu._id === menuId
        })
        setSelectedMenu(selectedMenu)
    }

    return (
        <Layout>
            <BtnContainer>
                <BurgerOfDayBtn onClick={() => handleModalBtnClick('item-of-day')}>
                    Burger of the Day
                </BurgerOfDayBtn>
            </BtnContainer>
            
            <nav>
                <MenusUl>
                    {props.menus.map(menu => {
                        return (
                            // TODO: make accessible and selectable with Enter
                            <MenuLi
                                tabIndex='0'
                                id={menu._id}
                                key={menu._id}
                                onClick={handleMenuSelection}
                                active={selectedMenu && 
                                    (selectedMenu._id === menu._id)
                                }
                            >
                                <MenuTitle 
                                    active={selectedMenu && 
                                        (selectedMenu._id === menu._id)
                                    }
                                    id={menu._id}
                                >
                                    {menu.name}
                                </MenuTitle>
                            </MenuLi>
                        )
                    })}
                </MenusUl>
            </nav>
            
            {selectedMenu && (
                <MenuItemsContainer>
                    {selectedMenu.menuItems.map((item, i) => {
                        const isItemOfDay = (item._id === itemOfDay._id)
                        return (
                            <MenuItem 
                                item={item} 
                                id={item._id} 
                                key={item._id}
                                index={i}
                                handleModalBtnClick={handleModalBtnClick}
                                isItemOfDay={isItemOfDay}
                                // TODO: update this here and inside of MenuItem?
                                itemOfDayDiscount={
                                    isItemOfDay
                                        ? ITEM_OF_DAY_DISCOUNT
                                        : 0
                                }
                            />
                        )
                    })}
                </MenuItemsContainer>
            )}

            {itemOfDayIsActive && (
                <MenuItemOfDayModal 
                    isOpen={itemOfDayIsActive}
                    itemOfDay={itemOfDay} 
                    discount={ITEM_OF_DAY_DISCOUNT}
                    handleModalBtnClick={handleModalBtnClick}
                />
            )}

            {activeMenuItem && (
                <OrderItemModal 
                    item={activeMenuItem}
                    isOpen={orderItemModalIsOpen}
                    isItemOfDay={activeMenuItem._id === itemOfDay._id}
                    itemOfDayDiscount={
                        activeMenuItem._id === itemOfDay._id
                            ? ITEM_OF_DAY_DISCOUNT
                            : 0
                    }
                    handleModalBtnClick={handleModalBtnClick}
                    showNoQuantityError={showNoQuantityError}
                    showNoOptionError={showNoOptionError}
                    setShowNoQuantityError={setShowNoQuantityError}
                    setShowNoOptionError={setShowNoOptionError}
                    setAddToOrderSuccessSnackbarIsActive={setAddToOrderSuccessSnackbarIsActive}
                />
            )}

            {addToOrderSuccessSnackbarIsActive && (
                <SnackbarContainer>
                    <AddOrderItemSuccessSnackbar>
                        Item has been added
                    </AddOrderItemSuccessSnackbar>
                </SnackbarContainer>
            )}
            
        </Layout>
    )
}

const menusQuery = `*[ _type == "menu" ] {
    _id,
    name,
    active,
    comments,
    "menuItems": menu_items[]-> {
        ...,
        add_ons[]->,
        options[]->
    }
} | order(menu_order asc)`

export async function getStaticProps() {
    const menus = await sanity.fetch(menusQuery)
    // const itemOfDayEligibleItems = await sanity.fetch(itemOfDayEligibleItemsQuery)
    return {
        props: { menus }
    }
}