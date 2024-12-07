describe('Todos', () => {
  beforeEach(() => {
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3004/todos'
      },
      {
        body: [
          {
            "text": "first",
            "isCompleted": true,
            "id": 1
          },
          {
            "text": "second",
            "isCompleted": false,
            "id": 2
          },
          {
            "text": "third",
            "isCompleted": false,
            "id": 3
          },
        ]
      }).intercept({
      method: 'POST',
      url: 'http://localhost:3004/todos'
    }, {
      body: {text: 'foo', id: 4, isCompleted: false},
    }).intercept({
      method: 'DELETE',
      url: 'http://localhost:3004/todos/1'
    }, {}).intercept({
      method: 'PATCH',
      url: 'http://localhost:3004/todos/1'
    }, {
      body: { text: 'foo', id: 5, isCompleted: false },
    }).visit('/')
  });

  it('Visits the initial project page', () => {
    cy.contains('todos')
  })

  it('renders 3 todos', () => {
    cy.get('[data-cy="todo"]').should('have.length', 3);

    cy.get('[data-cy="todoLabel"]').eq(0).should('contain.text', 'first');
    cy.get('[data-cy="todoLabel"]').eq(1).should('contain.text', 'second');
    cy.get('[data-cy="todoLabel"]').eq(2).should('contain.text', 'third');

    cy.get('[data-cy="todoCheckbox"]').eq(0).should('be.checked');
  })

  it('renders footer', () => {
    cy.get('[data-cy="todoCount"]').should('contain.text', '2 items left');
    cy.get('[data-cy="filterLink"]').eq(0)
      .should('contain.text', 'All')
      .should('have.class', 'selected');
    cy.get('[data-cy="filterLink"]').eq(1).should('contain.text', 'Active');
    cy.get('[data-cy="filterLink"]').eq(2).should('contain.text', 'Completed');
  });

  it('can change filter', () => {
    cy.get('[data-cy="filterLink"]').eq(1).click();
    cy.get('[data-cy="filterLink"]').eq(1).should('have.class', 'selected');
  });

  it('can add todo', () => {
    cy.get('[data-cy="newTodoInput"]').type('foo{enter}');
    cy.get('[data-cy="todoCount"]').should('contain.text', '3 items left');
    cy.get('[data-cy="todoLabel"]').eq(3).should('contain.text', 'foo');
  });

  it('can remove todo', () => {
    cy.get('[data-cy="destroy"]').eq(0).click({force: true});
    cy.get('[data-cy="todo"]').should('have.length', 2);
  });

  it('can toggle a todo', () => {
    cy.get('[data-cy="todoCheckbox"]').eq(0).click();
    cy.get('[data-cy="todoCheckbox"]').eq(0).should('not.be.checked');
  });

  it('can toggle all todos', () => {
    cy.intercept({
      method: 'PATCH',
      url: 'http://localhost:3004/todos/*'
    }, {
      body: { text: 'foo', id: 5, isCompleted: true },
    });

    cy.get('[data-cy="toggleAll"]').click();
    cy.get('[data-cy="todoCheckbox"]').eq(0).should('be.checked');
    cy.get('[data-cy="todoCheckbox"]').eq(1).should('be.checked');
    cy.get('[data-cy="todoCheckbox"]').eq(2).should('be.checked');
  });

  it('should update a todo', () => {
    cy.intercept({
      method: 'PATCH',
      url: 'http://localhost:3004/todos/1'
    }, {
      body: { text: 'bar', id: 1, isCompleted: false },
    });

    cy.get('[data-cy="todo"]').eq(0).dblclick();
    cy.get('[data-cy="edit"]').type('bar{enter}');
    cy.get('[data-cy="todoLabel"]').eq(0).should('have.text', 'bar');
  });
})
