import React from 'react'
import AboAddMedewerker from './AboAddMedewerker'

describe('<AboAddMedewerker />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AboAddMedewerker />)
  })
})