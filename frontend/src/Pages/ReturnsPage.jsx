import React, { useState } from "react";
import ReturnForm from "../Components/ReturnForm";
import Title from '../Components/Title';


const ReturnsPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div>
      <div className='border-t pt-16'>
    <div className='text-2x1'>
      <Title text1={'MY'} text2={'Return Requests'}/>
    </div>
    </div>
      <ReturnForm />
    </div>
  );
};

export default ReturnsPage;
