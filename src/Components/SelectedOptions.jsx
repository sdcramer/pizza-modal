import React, { useEffect, useState } from "react";

const SelectedOptions = (props) => {
  const [totalPrice, setTotalPrice] = useState(8);
  const [orderedCrust, setOrderedCrust] = useState([]);
  const [orderedToppings, setOrderedToppings] = useState([]);
  const { crust, sauce, toppings, crustOption, createOrderId } = props;

  const pizzaOrderCrustSummary = async () => {
    const getOrderedPizzaCrust = `query getOrderedPizzaCrustByCrustId($crustId: Int) {
  crust(where: {id: {_eq: $crustId}}) {
    name
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
          query: getOrderedPizzaCrust,
          variables: {
            crustId: crustOption.id,
          },
        }),
      }
    );
    const responseData = await response.json();
    setOrderedCrust(responseData.data.crust);
    console.log("orderedCrust ------>", orderedCrust);
  };
  const pizzaOrderToppingsSummary = async () => {
    const getOrderedPizzaToppings = `query getOrderedPizzaToppings ($orderId: Int) {
  order_pizza_topping(where: {order_pizza_id: {_eq: $orderId}}) {
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
          query: getOrderedPizzaToppings,
          variables: {
            orderId: createOrderId,
          },
        }),
      }
    );
    const responseData = await response.json();
    setOrderedToppings(responseData.data.order_pizza_topping);
    console.log("orderedToppings ------>", orderedToppings);
  };

  useEffect(() => {
    if (toppings.length > 2) {
      setTotalPrice(8 + toppings.length - 2);
    } else {
      setTotalPrice(8);
    }
  }, [toppings.length]);

  const orderSummaryHandler = () => {
    pizzaOrderCrustSummary();
    pizzaOrderToppingsSummary();
  };

  return (
    <div>
      <div className="title-card">
        <div className="my-pizza-title-container">My Pizza</div>
        <div className="selection-wrapper">
          <div className="crust-selection-text" style={{ fontWeight: "bold" }}>
            {crust}
          </div>
          <div>{sauce}</div>
          <div>{toppings.join(", ")}</div>
          <div>${totalPrice}</div>
        </div>
        <hr
          className="hr-style"
          style={{
            width: "360px",
          }}
        ></hr>
        <div className="quantity-add-order-card">
          <label>
            Quantity:
            <select className="quantity-drop-down">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
        </div>
        <div className="add-to-order-card">
          <button
            onClick={() => orderSummaryHandler()}
            className="add-to-order-btn"
            type="button"
          >
            Add To Order
          </button>
        </div>
        <div>
          <div style={{ fontWeight: "bold" }}>Order Summary:</div>
          <div>
            {orderedCrust?.map((crust, idx) => {
              return <div>{crust.name}</div>;
            })}
          </div>
          <div>{sauce}</div>
          <div>
            {orderedToppings.map((toppingName, idx) => {
              return <div>{toppingName.topping}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedOptions;

// [beef] = 8
// [beef, salami] = 8
// [beef, salami, pepperoni] = 9
// [beef, salami, pepperoni, sausage] = 10
// [beef, salami, pepperoni, sausage, pineapple] = 11
