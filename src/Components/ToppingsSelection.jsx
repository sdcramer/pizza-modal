const ToppingsSelection = (props) => {
  const {
    toppings,
    title,
    selectedToppingsOption,
    setSelectedToppingsOption,
    createOrderId,
  } = props;
  // console.log('createOrderId', createOrderId);

  // const selectedToppingsHandler = (name) => {
  //   if (selectedToppings.includes(name)) {
  //     const filteredToppings = selectedToppingsOption.filter(
  //       (toppingName) => toppingName !== name
  //     );
  //     setSelectedToppingsOption(filteredToppings);

  //     console.log(selectedToppings);
  //   } else {
  //     selectedToppings = [...selectedToppingsOption, name];
  //     console.log(selectedToppings);
  //     setSelectedToppingsOption(selectedToppings);
  //   }
  // };

  const getPizzaToOrderToppings = async () => {
    const getPizzaToOrderToppingsByOrderId = `query getPizzaOrderToppings($orderPizzaId: Int) {
  order_pizza_topping(where: {order_pizza_id: {_eq:$orderPizzaId}}) {
    order_pizza_id
    topping
  }
}`;
    const response = await fetch(
      "https://rich-oriole-45.hasura.app/v1/graphql",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret":
            "wuh9NMSlZKcXDrBcwKpE63IXtvAYklmDzOkdHe2tHbkysV1ZRsgAYOK6LZui3lJy",
          "X-REQUEST-TYPE": "GraphQL",
        },
        body: JSON.stringify({
          query: getPizzaToOrderToppingsByOrderId,
          variables: {
            orderPizzaId: createOrderId,
          },
        }),
      }
    );
    const responseData = await response.json();
    return responseData;
  };

  const removePizzaToOrderToppings = async (toppingName) => {
    const deletePizzaToOrderToppings = `mutation deletePizzaToOrder($orderPizzaId: Int, $topping: String) {
  delete_order_pizza_topping(where: {order_pizza_id: {_eq: $orderPizzaId}, topping: {_eq: $topping}}) {
    returning {
      order_pizza_id
      topping
    }
  }
}`;
    const response = await fetch(
      "https://rich-oriole-45.hasura.app/v1/graphql",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret":
            "wuh9NMSlZKcXDrBcwKpE63IXtvAYklmDzOkdHe2tHbkysV1ZRsgAYOK6LZui3lJy",
          "X-REQUEST-TYPE": "GraphQL",
        },
        body: JSON.stringify({
          query: deletePizzaToOrderToppings,
          variables: {
            orderPizzaId: createOrderId,
            topping: toppingName,
          },
        }),
      }
    );
    const responseData = await response.json();
    return responseData;
  };

  const addPizzaToOrderToppings = async (toppingName) => {
    const insertPizzaToOrderToppings = `mutation insertPizzaToOrderToppings($orderPizzaId: Int, $topping: String) {
  insert_order_pizza_topping(objects: {order_pizza_id: $orderPizzaId, topping: $topping}) {
    returning {
      order_pizza_id
      topping
    }
  }
}`;
    const response = await fetch(
      "https://rich-oriole-45.hasura.app/v1/graphql",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret":
            "wuh9NMSlZKcXDrBcwKpE63IXtvAYklmDzOkdHe2tHbkysV1ZRsgAYOK6LZui3lJy",
          "X-REQUEST-TYPE": "GraphQL",
        },
        body: JSON.stringify({
          query: insertPizzaToOrderToppings,
          variables: {
            orderPizzaId: createOrderId,
            topping: toppingName,
          },
        }),
      }
    );
    const responseData = await response.json();
    return responseData;
  };

  //write conditional if else statement for the two functions: if then delete else insert
  const pizzaOrderToppingsHandler = async (toppingName) => {
    let selectedToppings = selectedToppingsOption;
    const pizzaOrderToppingsData = await getPizzaToOrderToppings();
    pizzaOrderToppingsData?.data?.order_pizza_topping?.map((orderTopping) => {
      selectedToppings = [...selectedToppingsOption, orderTopping?.topping];
      setSelectedToppingsOption(selectedToppings);
      return selectedToppings;
    });
    if (selectedToppingsOption.includes(toppingName)) {
      const filteredToppings = selectedToppingsOption.filter(
        (topping) => topping !== toppingName
      );
      setSelectedToppingsOption(filteredToppings);
      removePizzaToOrderToppings(toppingName);
    } else {
      selectedToppings = [...selectedToppingsOption, toppingName];
      setSelectedToppingsOption(selectedToppings);

      addPizzaToOrderToppings(toppingName);
    }
  };

  return (
    <div>
      <div className="title-card">
        <div className="title-container">3. {title}</div>
        <div className="toppings-lightbulb-card">
          <img
            src="https://cache.dominos.com/olo/6_92_1/assets/build/images/img/bulb-blue.svg"
            className="toppings-lightbulb-image"
            alt=""
          ></img>
          <div className="topppings-lightbulb-coupon-message-card">
            <div className="topppings-lightbulb-add-2-coupon">
              Did you know you can add more than 2 toppings to this coupon?
            </div>
            <div className="toppings-lightbulb-additional-charges">
              (Additional charges may apply)
            </div>
          </div>
        </div>
        <div className="selection-wrapper">
          <div className="toppings-header">Choose Meats</div>
          <div className="toppings-selection-card">
            {toppings.map((topping, idx) => {
              if (topping.type === "true") {
                return (
                  <div>
                    <label className="toppings-selection-container">
                      <input
                        type="checkbox"
                        checked={selectedToppingsOption.includes(topping.name)}
                        value={topping.name}
                        name="choice"
                        onChange={() => pizzaOrderToppingsHandler(topping.name)}
                      />
                      {topping.name}
                    </label>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
        <hr
          className="hr-style"
          style={{
            width: "450px",
          }}
        ></hr>
        <div className="selection-wrapper">
          <div className="toppings-header">Choose Non-meats</div>
          <div className="toppings-selection-card">
            {toppings.map((topping, idx) => {
              if (topping.type !== "true") {
                return (
                  <div>
                    <label className="toppings-selection-container">
                      <input
                        type="checkbox"
                        checked={selectedToppingsOption.includes(topping.name)}
                        value={topping.name}
                        name="choice"
                        onChange={() => pizzaOrderToppingsHandler(topping.name)}
                      />
                      {topping.name}
                    </label>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToppingsSelection;
