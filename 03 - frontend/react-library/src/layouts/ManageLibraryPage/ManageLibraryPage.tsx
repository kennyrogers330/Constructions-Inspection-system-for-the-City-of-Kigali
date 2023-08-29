import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { AdminMessages } from "./Components/AdminMessages";
import { AddNewBook } from "./Components/AddNewBook";
import { ChangeQuantityOfBooks } from "./Components/ChangeQuantityOfBooks";
import { AddNewProject } from "./Components/AddNewProject";

export const ManageLibraryPage = () => {
    const { authState } = useOktaAuth();
    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);
    
    const [addBookClick, setAddBookClick] = useState(false);

    function addProjectClickFunction(){
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(false);
        setAddBookClick(false);
    }

    function changeQuantityOfBooksClickFunction(){
        setChangeQuantityOfBooksClick(true);
        setMessagesClick(false);
        setAddBookClick(false);
    }

    function messagesClickFunction(){
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(true);
        setAddBookClick(false);
    }

    function AddBookClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(false);
        setAddBookClick(true);
    }

    if (authState?.accessToken?.claims.userType !=="admin"){
        return <Redirect to='/home'/>
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3>Inspection Portal</h3>
                <nav>
                    <div className="nav nav-tabs" id='nav-tab' role='tablist'>

                        <button  onClick={addProjectClickFunction} className="nav-link active" id='nav-project-tab' data-bs-toggle='tab'
                        data-bs-target='#nav-project' type="button" role='tab' aria-controls='nav-project'
                        aria-selected='false'>
                            Add new Project
                        </button>

                        {/* <button onClick={AddBookClickFunction} className="nav-link" id='nav-add-book-tab' data-bs-toggle='tab'
                        data-bs-target='#nav-add-book' type="button" role='tab' aria-controls='nav-add-book'
                        aria-selected='false'>
                            Add new book
                        </button> */}
{/* 
                        <button  onClick={changeQuantityOfBooksClickFunction} className="nav-link" id='nav-quantity-tab' data-bs-toggle='tab'
                        data-bs-target='#nav-quantity' type="button" role='tab' aria-controls='nav-quantity'
                        aria-selected='true'>
                            Change quantity
                        </button> */}

                        <button  onClick={messagesClickFunction} className="nav-link" id='nav-messages-tab' data-bs-toggle='tab'
                        data-bs-target='#nav-messages' type="button" role='tab' aria-controls='nav-messages'
                        aria-selected='false'>
                            Messages
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id='nav-tabContent'>
                    
                    <div className="tab-pane fade show active" id='nav-project' role='tabpanel' aria-labelledby="nav-project-tab">
                         <AddNewProject/> 
                    </div>
                    
                    {/* <div className="tab-pane fade" id='nav-add-book' role='tabpanel'
                    aria-labelledby="nav-add-book-tab">
                       {addBookClick ?  <AddNewBook/>: <></> }
                    </div> */}

                    {/* <div className="tab-pane fade" id='nav-quantity' role='tabpanel' aria-labelledby="nav-quantity">
                        {changeQuantityOfBooksClick ? <ChangeQuantityOfBooks/> : <></>}
                    </div> */}

                    <div className="tab-pane fade" id='nav-messages' role='tabpanel' aria-labelledby="nav-messages-tab">
                        {messagesClick ? <AdminMessages/> : <></>} 
                    </div>
                </div>
            </div>
        </div>
    );
}