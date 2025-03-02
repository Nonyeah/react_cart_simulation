import React from "react";
import { useState, useRef } from "react";

export default function App() {
  return <Cart />;
}

const products = [
  { id: 0, name: "Kayla Tote", price: 129, quantity: 0 },
  { id: 1, name: "carys clutch", price: 69, quantity: 0 },
  { id: 2, name: "athena tote", price: 185, quantity: 0 },
  { id: 3, name: "Chloe Clutch", price: 49, quantity: 0 },
  { id: 4, name: "Emerald Dragon Ring", price: 59, quantity: 0 },
  {id: 5, name: "diana jersey jumpsuit", price: 29, quantity: 0}
];

function Cart() {
  const [item, setitem] = useState([]);
  const [checkout, setcheckout] = useState(false);
  const [shipping, setshipping] = useState(null);
  const [payment, setpayment] = useState(null);
  const [shippingalert, setshippingalert] = useState("");
  const [complete, setcomplete] = useState(false);
  const [error, seterror] = useState("");
  const [confirmpay, setconfirmpay] = useState(false);

  function removeItem(button) {
    let itemDelete = item.find((product) => product.id == button.id);
    let basket = item.filter((product) => product.id != itemDelete.id);
    if (!basket.length) {
      setitem(basket);
      setcheckout(false);
      setshipping(null);
    } else {
      setitem(basket);
      setcheckout(true);
    }
  }

  function changeAmount(baskettotal, setbaskettotal, iteminbasket, quantity) {
    let itemModified = baskettotal.find((item) => item.id == iteminbasket.id);
    let original = products.find((item) => item.id == itemModified.id);
    let nonmodifieditems = baskettotal.filter(
      (item) => item.id != itemModified.id
    );
    let index = baskettotal.indexOf(itemModified);
    let updatedItem = {
      ...itemModified,
      price: original.price * quantity,
      quantity: quantity,
    };
    nonmodifieditems.splice(index, 0, updatedItem);
    setbaskettotal(nonmodifieditems);
  }

  function selectshipping(e) {
    if (e.target.value.includes("standard")) {
      setshipping(3.95);
    } else if (e.target.value.includes("express")) {
      setshipping(6.95);
    }
  }

  if (checkout) {
    let total = 0;
    item.forEach((item) => (total += item.price));
    return (
      <div className="checkoutpage">
        <ul>
          {item.map((basket) => (
            <Checkout
              key={basket.id}
              iteminbasket={basket}
              removeiteminbasket={removeItem}
              baskettotal={item}
              changeAmount={changeAmount}
              setbaskettotal={setitem}
            />
          ))}
        </ul>

        <div className="continue">
          <div className="total">
            <p>Total: £{total + shipping}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setcheckout(false);
              setpayment(false);
              setshipping(null);
            }}
          >
            continue Shopping
          </button>
          <button
            type="button"
            onClick={() => {
              if (!shipping) {
                setshippingalert("Please select a shipping method ");
                return;
              }

              setcheckout(false);
              setpayment(true);
            }}
          >
            checkout proceed
          </button>
        </div>
        <Shipping
          selectshipping={selectshipping}
          shippingalert={shippingalert}
          shipping={shipping}
        />
      </div>
    );
  } else if (payment) {
    return (
      <Payment
        cartcontents={item}
        shipping={shipping}
        setcheckout={setcheckout}
        setcomplete={setcomplete}
        setpayment={setpayment}
      />
    );
  } else if (complete) {
    return (
      <Address
        item={item}
        setconfirmpay={setconfirmpay}
        setcomplete={setcomplete}
        shipping={shipping}
        setpayment={setpayment}
      />
    );
  } else if (confirmpay) {
    return (
      <CreditCard setcomplete={setcomplete} setconfirmpay={setconfirmpay} />
    );
  } else {
    let total = null;
    item.forEach((value) => (total += value.price));
    return (
      <>
        <div className="cart">
          <ul>
            {item.map((displayproduct) => (
              <DisplayItems
                singlecartitem={displayproduct}
                setitem={setitem}
                cartcontents={item}
                key={displayproduct.id}
              />
            ))}
          </ul>
          <div className="totalbox">
            <p className="errormessage" style={{ color: "red" }}>
              {error}
            </p>
            <span className="total">
              {total || total == 0 ? `£${total.toFixed(2)}` : null}
            </span>
            <button
              type="button"
              className="checkout"
              onClick={() => {
                if (!item.length) {
                  seterror("Please add an item to the cart");
                  return;
                }
                if (total == 0) return;
                setcheckout(true);
              }}
            >
              checkout
            </button>
          </div>
        </div>
        <Buttons
          setItemsInCart={setitem}
          itemsInCart={item}
          seterror={seterror}
          error={error}
        />
        <ClearCart clearcartcontents={setitem} />
      </>
    );
  }
}

function Checkout({
  baskettotal,
  iteminbasket,
  setbaskettotal,
  removeiteminbasket,
  changeAmount,
}) {
  return (
    <li key={iteminbasket.id}>
      <span>{iteminbasket.name}</span>
      <button onClick={() => removeiteminbasket(iteminbasket)}>delete </button>
      <input
        value={iteminbasket.quantity}
        onChange={(e) => {
          changeAmount(
            baskettotal,
            setbaskettotal,
            iteminbasket,
            e.target.value
          );
        }}
        size="2"
      />
      <span>{`£${iteminbasket.price.toFixed(2)}`}</span>
    </li>
  );
}

function DisplayItems({ singlecartitem, setitem, cartcontents }) {
  const [value, setvalue] = useState("");
  let displayitem = products.find((item) => item.id === singlecartitem.id);

  function updater(carttotal, quantity) {
    let itemmodified = carttotal.find((elem) => elem.id == singlecartitem.id);
    if (itemmodified) {
      let index = carttotal.indexOf(itemmodified);
      let nonmodifieditems = carttotal.filter(
        (item) => item.id != itemmodified.id
      );
      let modifiedproduct = {
        ...itemmodified,
        price: displayitem.price * quantity,
        quantity: quantity,
      };
      nonmodifieditems.splice(index, 0, modifiedproduct);
      return nonmodifieditems;
    }
  }
  return (
    <li className="itemsincart">
      <span>{singlecartitem.name}</span>
      {value
        ? `£${singlecartitem.price.toFixed(2)} `
        : `£${singlecartitem.price.toFixed(2)}`}
      <input
        size="2"
        onChange={(e) => {
          setvalue(e.target.value);
          setitem(updater(cartcontents, +e.target.value));
        }}
        value={singlecartitem.quantity}
      />
    </li>
  );
}

function Shipping({ selectshipping, shippingalert, shipping }) {
  return (
    <div className="shippingcontainer">
      <span>Shipping options</span>
      <select onChange={(e) => selectshipping(e)}>
        <option value="">--Please choose an option--</option>
        <option value="standard">standard shipping - £3.95</option>
        <option value="express">express shipping - £6.95</option>
      </select>
      <p style={{ color: "red" }}>{shipping ? "" : shippingalert}</p>
    </div>
  );
}

function ClearCart({ clearcartcontents }) {
  return (
    <div className="clearcart">
      <button type="button" onClick={() => clearcartcontents([])}>
        {" "}
        clear cart
      </button>
    </div>
  );
}

function CreditCard({ setconfirmpay, setcomplete }) {
  return (
    <div className="paymentcontainer">
      <div className="cardlogos">
        <p>Payment options</p>
        <img src="https://www.thefashionconnector.com/credit_card3.jpg" />
      </div>

      <form className="formpayment">
        <div className="cardname">
          <p>Name on card</p>
          <input type="text" required />
        </div>

        <div className="cardnumber">
          <p>Card number</p>
          <input type="text" required />
        </div>

        <div className="cvv">
          <div>
            <p> Expiry Date </p>
            <p>
              <span>Format: MM/YY</span>
            </p>
            <input type="text" required />
          </div>
          <div>
            <p>Security Code (CVV) </p>
            <p>
              <span>3 digit code</span>
            </p>
            <input type="text" required />
          </div>
        </div>

        <div className="paynow">
          <button type="submit" onClick={(e) => e.preventDefault()}>
            Pay Now{" "}
          </button>
        </div>

        <div className="paymentbuttons">
          <button
            onClick={() => {
              setconfirmpay(false);
              setcomplete(true);
            }}
          >
            back to cart
          </button>
        </div>
      </form>
    </div>
  );
}

function Payment({
  cartcontents,
  shipping,
  setcheckout,
  setcomplete,
  setpayment,
}) {
  let total = 0;
  cartcontents.forEach((value) => (total += value.price));
  return (
    <div className="checkoutitems">
      <h3>Product Description</h3>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {cartcontents.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{`£${product.price}`}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2"></td>
            <td>{`Total: £${total.toFixed(2)}`}</td>
          </tr>
        </tfoot>
      </table>
      <div className="checkouttotal">
        <p>Subtotal: £{total.toFixed(2)}</p>
        <p>Shipping: £{shipping}</p>
        <p>Total: £{total + shipping}</p>
      </div>

      <div className="paymentbuttons">
        <button onClick={() => setcheckout(true)}>back to cart</button>{" "}
        <button
          type="button"
          onClick={() => {
            setpayment(null);
            setcomplete(true);
          }}
        >
          payment
        </button>
      </div>
    </div>
  );
}

function Title({ storeUserInput }) {
  const [title, settitle] = useState("");
  return (
    <>
      <p>
        <span>Title</span>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            settitle(e.target.value);
            storeUserInput(e);
          }}
          required
        />{" "}
      </p>
    </>
  );
}

function FirstName({ storeUserInput }) {
  const [firstname, setfirstname] = useState("");
  return (
    <>
      <p>
        <span>First Name*</span>{" "}
        <input
          type="text"
          id="firstname"
          value={firstname}
          onChange={(e) => {
            setfirstname(e.target.value);
            storeUserInput(e);
          }}
          required
        />
      </p>
    </>
  );
}

function LastName({ storeUserInput }) {
  const [lastname, setlastname] = useState("");
  return (
    <>
      <p>
        <span>Last Name*</span>
        <input
          type="text"
          id="lastname"
          value={lastname}
          onChange={(e) => {
            setlastname(e.target.value);
            storeUserInput(e);
          }}
          required
        />
      </p>
    </>
  );
}

function Address1({ storeUserInput }) {
  const [address1, setaddress1] = useState("");
  return (
    <>
      <p>
        <span>Address 1* </span>
        <input
          type="text"
          id="address1"
          value={address1}
          onChange={(e) => {
            setaddress1(e.target.value);
            storeUserInput(e);
          }}
          required
        />
      </p>
    </>
  );
}

function Address2({ storeUserInput }) {
  const [address2, setaddress2] = useState("");
  return (
    <>
      <p>
        <span>Address 2</span>
        <input
          type="text"
          id="address2"
          value={address2}
          onChange={(e) => {
            setaddress2(e.target.value);
            storeUserInput(e);
          }}
        />
      </p>
    </>
  );
}

function Town({ storeUserInput }) {
  const [town, settown] = useState("");
  return (
    <>
      <p>
        <span>Town*</span>
        <input
          value={town}
          type="text"
          id="town"
          onChange={(e) => {
            settown(e.target.value);
            storeUserInput(e);
          }}
          required
        />
      </p>
    </>
  );
}

function County({ storeUserInput }) {
  const [county, setcounty] = useState("");
  return (
    <>
      <p>
        <span>County</span>
        <input
          value={county}
          type="text"
          id="county"
          onChange={(e) => {
            setcounty(e.target.value);
            storeUserInput(e);
          }}
        />
      </p>
    </>
  );
}

function Country({ storeUserInput }) {
  const [country, setcountry] = useState("");
  return (
    <>
      <p>
        <span>Country*</span>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => {
            setcountry(e.target.value);
            storeUserInput(e);
          }}
          required
        />
      </p>
    </>
  );
}

function Postcode({ storeUserInput }) {
  const [postcode, setpostcode] = useState("");
  return (
    <>
      <p>
        <span>Postcode*</span>
        <input
          type="text"
          id="postcode"
          value={postcode}
          onChange={(e) => {
            setpostcode(e.target.value);
            storeUserInput(e);
          }}
          required
        />
      </p>
    </>
  );
}

function Telephone({ storeUserInput }) {
  const [telephone, settelephone] = useState("");
  return (
    <>
      <p>
        <span>Telephone*</span>
        <input
          value={telephone}
          type="tel"
          id="telephone"
          onChange={(e) => {
            settelephone(e.target.value);
            storeUserInput(e);
          }}
        />
      </p>
    </>
  );
}

function Email({ storeUserInput }) {
  const [email, setemail] = useState("");
  return (
    <>
      <p>
        <span>Email*</span>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
            storeUserInput(e);
          }}
        />
      </p>
    </>
  );
}

function TitleSame({ map }) {
  return (
    <>
      <p>
        <span>Title*</span>
        <input
          value={map.current.get("title")}
          type="text"
          id="title"
          readOnly={true}
        />
      </p>
    </>
  );
}

function FirstNameSame({ map }) {
  return (
    <p>
      <span>First Name*</span>
      <input
        type="text"
        id="firstname"
        value={map.current.get("firstname")}
        readOnly={true}
      />
    </p>
  );
}

function LastNameSame({ map }) {
  return (
    <p>
      <span>Last Name*</span>
      <input type="text" value={map.current.get("lastname")} readOnly={true} />
    </p>
  );
}
function Address1Same({ map }) {
  return (
    <p>
      <span>Address1*</span>
      <input type="text" value={map.current.get("address1")} readOnly={true} />
    </p>
  );
}

function Address2Same({ map }) {
  return (
    <p>
      <span>Address2*</span>
      <input type="text" value={map.current.get("address2")} readOnly={true} />
    </p>
  );
}

function TownSame({ map }) {
  return (
    <p>
      <span>Town*</span>
      <input type="text" value={map.current.get("town")} readOnly={true} />
    </p>
  );
}

function CountySame({ map }) {
  return (
    <p>
      <span>County</span>
      <input type="text" value={map.current.get("county")} readOnly={true} />
    </p>
  );
}

function PostcodeSame({ map }) {
  return (
    <>
      <p>
        <span>Postcode*</span>
        <input
          value={map.current.get("postcode")}
          type="text"
          id="postcode"
          readOnly={true}
        />
      </p>
    </>
  );
}

function TelephoneSame({ map }) {
  return (
    <>
      <p>
        <span>Telephone*</span>
        <input
          value={map.current.get("telephone")}
          type="tel"
          id="telephone"
          readOnly={true}
        />
      </p>
    </>
  );
}

function EmailSame({ map }) {
  return (
    <>
      <p>
        <span>Email*</span>
        <input
          value={map.current.get("email")}
          type="email"
          id="email"
          readOnly={true}
        />
      </p>
    </>
  );
}

function OtherInfo() {
  return (
    <>
      <p className="otherinfo">Other information</p>
      <p>How did you hear about us? </p>
      <select>
        <option>Please Select</option>
        <option>Facebook</option>
        <option>Google</option>
        <option>Twitter</option>
        <option>Pinterest</option>
        <option>Tik Tok</option>
        <option>Through a friend</option>
        <option>Instagram</option>
        <option>Other</option>
      </select>
    </>
  );
}

function PaymentButtons({ paybycreditcard, setcomplete }) {
  return (
    <div className="payment">
      <button
        type="button"
        onClick={() => {
          paybycreditcard(true);
          setcomplete(false);
        }}
      >
        Click here to pay with your credit/debit card using Barclay Card
        payments
      </button>
      <button
        type="button"
        onClick={() => {
          paybycreditcard(true);
          setcomplete(false);
        }}
      >
        click here to pay with your credit card using Pay Pal
      </button>
    </div>
  );
}

function Address({ item, setpayment, setconfirmpay, setcomplete, shipping }) {
  let total = 0;
  item.forEach((amount) => (total += amount.price));
  const [sameaddress, setsameaddress] = useState(false);
  const ref = useRef(null);

  function storeUserInput(e) {
    if (!ref.current) {
      ref.current = new Map();
    }
    ref.current.set(e.target.id, e.target.value);
  }

  const paymentTable = item.map((buy) => (
    <tr key={buy.id}>
      <td>{buy.name}</td>
      <td>{buy.quantity}</td>
      <td>£{buy.price}</td>
    </tr>
  ));

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{paymentTable}</tbody>
        <tfoot>
          <tr>
            <td colSpan="2"></td>
            <td>{`Total Including Shipping: £${total + shipping}`}</td>
          </tr>
        </tfoot>
      </table>

      <form>
        <p>
          {" "}
          Please enter your details below For credit/debit card orders, the
          address should be where your credit/debit card is registered
        </p>
        <p className="billing">Billing address</p>
        <Title storeUserInput={storeUserInput} />
        <FirstName storeUserInput={storeUserInput} />
        <LastName storeUserInput={storeUserInput} />
        <Address1 storeUserInput={storeUserInput} />
        <Address2 storeUserInput={storeUserInput} />
        <Town storeUserInput={storeUserInput} />
        <County storeUserInput={storeUserInput} />
        <Postcode storeUserInput={storeUserInput} />
        <Telephone storeUserInput={storeUserInput} />
        <Email storeUserInput={storeUserInput} />

        <p className="same">
          Delivery address{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!ref.current) return;
              setsameaddress(true);
            }}
          >
            click here if the same as above
          </a>
        </p>

        <div className="paymentbuttons">
          <button
            onClick={() => {
              setpayment(true);
              setcomplete(false);
            }}
          >
            back to cart
          </button>
        </div>

        {sameaddress && (
          <>
            <p className="delivery">Delivery address</p>
            <TitleSame map={ref} />
            <FirstNameSame map={ref} />
            <LastNameSame map={ref} />
            <Address1Same map={ref} />
            <Address2Same map={ref} />
            <TownSame map={ref} />
            <CountySame map={ref} />
            <PostcodeSame map={ref} />
            <TelephoneSame map={ref} />
            <EmailSame map={ref} />
            <OtherInfo />
            <PaymentButtons
              paybycreditcard={setconfirmpay}
              setcomplete={setcomplete}
              setpayment={setpayment}
            />

            <div className="paymentbuttons">
              <button
                onClick={() => {
                  setpayment(true);
                  setcomplete(false);
                }}
              >
                back to cart
              </button>{" "}
              <button
                type="button"
                onClick={() => {
                  setcomplete(false);
                  setconfirmpay(true);
                }}
              >
                payment
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
}

function Buttons({ setItemsInCart, itemsInCart, seterror, error }) {
  function addItem(cartProduct) {
    let itemSelected = products.find((item) => item.id == cartProduct.id);
    let itemMultiple = itemsInCart.find((item) => item.id == itemSelected.id);
    if (itemMultiple) {
      let index = itemsInCart.indexOf(itemMultiple);
      let nonDuplicates = itemsInCart.filter(
        (duplicate) => duplicate.id != itemMultiple.id
      );
      let modifiedproduct = {
        ...itemMultiple,
        price: itemMultiple.price + cartProduct.price,
        quantity: itemMultiple.quantity + 1,
      };

      nonDuplicates.splice(index, 0, modifiedproduct);

      setItemsInCart(nonDuplicates);
    } else {
      setItemsInCart([
        ...itemsInCart,
        { ...itemSelected, quantity: itemSelected.quantity + 1 },
      ]);
    }
  }

  function removeItem(cartProduct) {
    let itemSelected = products.find((item) => item.id == cartProduct.id);
    let itemtoBeRemoved = itemsInCart.find(
      (item) => item.id == itemSelected.id
    );
    if (!itemtoBeRemoved) return;
    let itemsToKeep = itemsInCart.filter(
      (keepitem) => keepitem.id != itemtoBeRemoved.id
    );

    if (itemtoBeRemoved && itemtoBeRemoved.price == cartProduct.price) {
      setItemsInCart([...itemsToKeep]);
    } else {
      let index = itemsInCart.indexOf(itemtoBeRemoved);
      let itemModified = {
        ...itemtoBeRemoved,
        price: itemtoBeRemoved.price - cartProduct.price,
        quantity: itemtoBeRemoved.quantity - 1,
      };
      itemsToKeep.splice(index, 0, itemModified);
      setItemsInCart(itemsToKeep);
    }
  }

  const buttonList = products.map((bag) => (
    <li key={bag.id}>
      <span>{bag.name}</span>
      <button
        tye="button"
        onClick={() => {
          if (error) seterror("");
          addItem(bag);
        }}
      >
        +
      </button>
      <button
        type="button"
        onClick={() => {
          if (error) seterror("");
          removeItem(bag);
        }}
      >
        -
      </button>
    </li>
  ));
  return (
    <div className="buttonlist">
      <ul>{buttonList}</ul>
    </div>
  );
}
