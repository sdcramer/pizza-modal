import React, { useState, useEffect } from "react";
import { atom, useAtom } from "jotai";

import ToppingsSelection from "./Components/ToppingsSelection";
import SauceSelection from "./Components/SauceSelection";
import CrustSelection from "./Components/CrustSelection";
import SelectedOptions from "./Components/SelectedOptions";
import "./App.css";

const App = () => {
  const orderIdAtom = atom(0);
  const [crustOption, setCrustOption] = useState({});
  const [selectedSauceOption, setSauceOption] = useState("");
  const [selectedToppingsOption, setSelectedToppingsOption] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [createOrderId, setCreateOrderId] = useAtom(orderIdAtom);
  const [pizzaOrderData, setPizzaOrderData] = useState({});
  const [pizzaStarted, setPizzaStarted] = useState(false);
  // const orderIdAtom = atom(createOrderId)
  // const orderIdAtom = atom(0)
  // const [orderId, setOrderId] = useAtom(orderIdAtom)

  const insertOrderHandler = async () => {
    const insertOrder = `mutation InsertOrder {
  insert_Orders(objects: {}) {
    affected_rows
    returning {
      id
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
          query: insertOrder,
        }),
      }
    );
    const responseData = await response.json();
    setCreateOrderId(responseData.data.insert_Orders.returning[0].id);
    // console.log("responseData", responseData);
  };

  // console.log("createOrderId", createOrderId);

  const fetchMenuItemsHandler = async () => {
    const getAllMenuItems = `query GetAllMenuItems {
  crust {
    name
    gluten_free
    id
  }
  toppings {
    name
    type
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
          query: getAllMenuItems,
        }),
      }
    );
    const responseData = await response.json();
    setAllMenuItems(responseData);
  };
  // console.log(
  //   "object received from response on query get allMenuItems",
  //   allMenuItems
  // );

  useEffect(() => {
    fetchMenuItemsHandler();
    insertOrderHandler();
  }, []);

  const insertPizzaToOrder = async () => {
    const addPizzaOrder = `mutation AddPizzaToOrder($orderId: Int, $crustId: Int) {
  insert_order_pizza(objects: {order_id: $orderId, crust_id: $crustId}) {
    returning {
      crust_id
      order_id
    }
    affected_rows
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
          query: addPizzaOrder,
          variables: {
            orderId: createOrderId,
            crustId: crustOption.id,
          },
        }),
      }
    );
    const responseData = await response.json();
    setPizzaOrderData(responseData);
  };
  const updatePizzaToOrder = async () => {
    const addPizzaOrder = `mutation updatePizzaToOrder($orderId: Int, $crustId: Int) {
  update_order_pizza(where: {order_id: {_eq: $orderId}}, _set: {crust_id: $crustId}) {
    returning {
      crust_id
      order_id
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
          query: addPizzaOrder,
          variables: {
            orderId: createOrderId,
            crustId: crustOption.id,
          },
        }),
      }
    );
    const responseData = await response.json();
    setPizzaOrderData(responseData);
  };
  const pizzaOrderHandler = async () => {
    if (crustOption.id) {
      setPizzaStarted(true);
    }
    if (
      !pizzaOrderData?.data?.insert_order_pizza?.returning?.[0]?.crust_id &&
      crustOption
    ) {
      insertPizzaToOrder();
    } else if (
      crustOption.id !==
      pizzaOrderData?.data?.insert_order_pizza?.returning?.[0]?.crust_id
    ) {
      updatePizzaToOrder();
    } else {
      return;
    }
  };
  // console.log("data returned from pizza order mutation", pizzaOrderData);

  const menuItems = [
    {
      title: "Size & Crust",
    },
    {
      title: "Sauce",
      names: [
        "Robust Inspired Tomato Sauce",
        "Hearty Marinara Sauce",
        "Honey BBQ Sauce",
        "Garlic Parmesan Sauce",
        "Alfredo Sauce",
        "Ranch",
      ],
    },
    {
      title: "Toppings",
    },
  ];

  const sauceSelectionToggle =
    crustOption.id && pizzaOrderData && pizzaStarted ? (
      <SauceSelection
        title={menuItems[1].title}
        names={menuItems[1].names}
        selectedSauceOption={selectedSauceOption}
        setSauceOption={setSauceOption}
      />
    ) : (
      <div></div>
    );

  const toppingsSelectionToggle = selectedSauceOption ? (
    <ToppingsSelection
      title={menuItems[2].title}
      toppings={allMenuItems.data.toppings}
      selectedToppingsOption={selectedToppingsOption}
      setSelectedToppingsOption={setSelectedToppingsOption}
      createOrderId={createOrderId}
    />
  ) : (
    <div></div>
  );

  const selectedOptionsToggle =
    crustOption.id && pizzaOrderData && pizzaStarted ? (
      <SelectedOptions
        crust={crustOption.name}
        sauce={selectedSauceOption}
        toppings={selectedToppingsOption}
        crustOption={crustOption}
        createOrderId={createOrderId}
      />
    ) : (
      <div></div>
    );

  // const orderSummaryToggle =
  //   crustOption.id && pizzaOrderData && pizzaStarted ? (
  //     <OrderSummary
  //       crustOrdered={}
  //       sauceOrdered={}
  //       toppingsOrdered={}

  //     />
  //   ) : (
  //     <div></div>
  //   );

  // console.log("funky crust stuff", crustOption ? "" : crustOption.name);
  // console.log("selectedToppigsOption", selectedToppingsOption);
  // console.log("crustOption", crustOption);
  return (
    <div className="root-wrapper">
      <div className="main-wrapper">
        <div>
          <h1 className="pizza-builder-header">Domino's Pizza Builder</h1>
        </div>
        <div className="pizza-builder-flex-wrapper">
          <div className="pizza-builder-flex-column">
            <CrustSelection
              title={menuItems[0].title}
              crusts={allMenuItems?.data?.crust}
              selectedCrustOption={crustOption.name ?? ""}
              setCrustOption={setCrustOption}
            />
            <div className="add-to-order-card">
              <button
                onClick={() => pizzaOrderHandler()}
                className="add-to-order-btn"
                type="button"
                disabled={false}
              >
                Add Pizza
              </button>
            </div>
            {sauceSelectionToggle}
            {toppingsSelectionToggle}
          </div>
          <div className="selectedOptions-wrapper">
            <div>{selectedOptionsToggle}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
