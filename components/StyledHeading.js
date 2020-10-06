import styled from 'styled-components'

// TODO: this isn't active right now. Need to look into if this is better than using `sign_font` CSS class
const Heading = ({ className, children, hTag }) => {
    // console.log('hTag: ', hTag)
    const HeadingTag = hTag
    return (
        <HeadingTag 
            className={className}
            children={children}
        />
    )
}

const StyledHeadingTag = styled(Heading)`
    font-family: 'Bebas Neue', cursive;
    display: inline-block;
    padding: 5px;
    background-color: ${props => props.bgColor};
    &:hover {
        cursor: pointer;
    }
`

export default function StyledHeading({ 
    hTag,
    hTagText,
    bgColor,
    textColor,
    textAlign,
    fontSize,
    margin,
    padding,
    borderRadius
}) {
   return (
        <StyledHeadingTag
            bgColor={bgColor}
            hTag={hTag}
        >
            {hTagText}
        </StyledHeadingTag>
   )
}
