window.onload = function () {
    "use strict";

    let columnCounter = 2,
        cardCounter = 3;

    const newColumnTitle = document.getElementById('new-column-title'),
        inputError = document.getElementById('input-error-title'),
        columnAdder = document.getElementById('column-adder'),
        columns = document.getElementById('columns'),
        cancelColumn = document.getElementById('cancel-column'),
        makeColumnButton = document.getElementById('make-column'),
        trashcan = document.getElementById('trashcan'),
        columnAdderFooter = document.getElementById('column-adder-footer'),
        columnSearcher = document.querySelector('#column-searcher input');

    function generateColumnId() {
        return columnCounter++;
    }

    function generateCardId() {
        return cardCounter++;
    }

    function makeNewColumn(name, footerBool) {
        const columnId = generateColumnId();

        let column = document.createElement('div'),
            columnTitle = document.createElement('div'),
            sortFlagButton = document.createElement('div'),
            sortFlagButtonText = document.createTextNode('Флаг'),
            sortDateButton = document.createElement('div'),
            sortDateButtonText = document.createTextNode('Дата'),
            columnContent = document.createElement('div'),
            dropPlace = document.createElement('div'),
            columnTitleText = document.createTextNode(name),
            newCardAdder = document.createElement('div'),
            cardAdderText = document.createTextNode('Добавить карточку'),
            columnTitleSpan = document.createElement('span');

        column.className = 'column';
        column.id = columnId + '-column';
        columnTitle.className = 'column-title';
        sortFlagButton.appendChild(sortFlagButtonText);
        sortFlagButton.classList.add('sort-flag', 'btn', 'btn-small', 'btn-gray');
        sortDateButton.classList.add('sort-date', 'btn', 'btn-small', 'btn-gray');
        sortDateButton.appendChild(sortDateButtonText);
        columnContent.className = 'column-content';
        dropPlace.className = 'drop-place-card';

        dropPlace.addEventListener('dragenter', handleDragEnterCard, false);
        dropPlace.addEventListener('dragleave', handleDragLeaveCard, false);
        dropPlace.addEventListener('drop', handleDropCard, false);
        dropPlace.addEventListener('dragover', handleDragOverCard, false);

        sortFlagButton.addEventListener('click', function (el) {
            let cards = el.target.parentElement.querySelectorAll('.card'),
                sortedCards = Array.prototype.slice.call(cards).sort(function (a, b) {
                    if (a.querySelector('.card-flag').classList.contains('type2') && b.querySelector('.card-flag').classList.contains('type1'))
                        return -1;
                    if (a.querySelector('.card-flag').classList.contains('type3') && b.querySelector('.card-flag').classList.contains('type2'))
                        return -1;
                    if (a.querySelector('.card-flag').classList.contains('type3') && b.querySelector('.card-flag').classList.contains('type1'))
                        return -1;
                    return 1;
                });
            for (let i = 0; i < sortedCards.length; i++) {
                el.target.parentElement.querySelector('.column-content').insertBefore(sortedCards[i], el.target.parentElement.querySelectorAll('.drop-place-card')[i + 1]);
            }
        });

        sortDateButton.addEventListener('click', function (el) {
            let cards = el.target.parentElement.querySelectorAll('.card'),
                sortedCards = Array.prototype.slice.call(cards).sort(function (a, b) {
                    if (a.querySelector('.card-date').textContent === '' && b.querySelector('.card-date').textContent !== '') return 1;
                    let aDateMas = a.querySelector('.card-date').textContent.split('.'),
                        aDateString = aDateMas[2] + '-' + aDateMas[1] + '-' + aDateMas[0],
                        bDateMas = b.querySelector('.card-date').textContent.split('.'),
                        bDateString = bDateMas[2] + '-' + bDateMas[1] + '-' + bDateMas[0],
                        aDate = new Date(aDateString),
                        bDate = new Date(bDateString);
                    if (aDate > bDate) return 1;
                    return -1;
                });
            for (let i = 0; i < sortedCards.length; i++) {
                el.target.parentElement.querySelector('.column-content').insertBefore(sortedCards[i], el.target.parentElement.querySelectorAll('.drop-place-card')[i + 1]);
            }
        });

        columnTitleSpan.addEventListener('click', function (columnTitle) {
            let editColumnTitle = columnTitle.target.parentElement.querySelector('.edit-column-title');
            if (editColumnTitle) {
                editColumnTitle.style.display = 'inline-block';
                editColumnTitle.classList.add('active');
                editColumnTitle.value = columnTitleSpan.textContent;
                let acceptEditTitle = editColumnTitle.parentElement.querySelector('.accept-edit-button');
                acceptEditTitle.style.display = 'inline-block';
                let cancelEditTitle = editColumnTitle.parentElement.querySelector('.cancel-edit-button');
                cancelEditTitle.style.display = 'inline-block';
                columnTitleSpan.style.display = 'none';
            } else {
                let editColumnTitle = document.createElement('input');
                editColumnTitle.addEventListener('input', function (newColumnTitle) {
                    let newColumnTitleVal = newColumnTitle.target.value;
                    newColumnTitleVal.trim()
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");
                    let editTitleError = newColumnTitle.target.parentElement.parentElement.querySelector('.edit-title-error');
                    if (newColumnTitleVal.length === 35) {
                        editTitleError.innerText = 'Вы ввели максимальное количество символов';
                        editTitleError.style.display = 'block';
                    } else if (editTitleError.style.display === 'block') {
                        editTitleError.style.display = 'none';
                    }
                });

                editColumnTitle.classList.add('edit-column-title', 'active');
                editColumnTitle.value = columnTitle.target.textContent;
                editColumnTitle.maxLength = "35";
                columnTitle.target.style.display = 'none';

                let cancelEditButton = document.createElement('div'),
                    acceptEditButton = document.createElement('div'),
                    acceptEditButtonImg = document.createElement('img');

                acceptEditButton.className = 'accept-edit-button';
                acceptEditButton.appendChild(acceptEditButtonImg);

                acceptEditButton.addEventListener('click', function (acceptEditButton) {
                    let newColumnTitle = acceptEditButton.target.parentElement.querySelector('input'),
                        newColumnTitleVal = newColumnTitle.value;
                    newColumnTitleVal.trim()
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");
                    let editTitleError = newColumnTitle.parentElement.querySelector('.edit-title-error');
                    if (newColumnTitleVal.length === 0) {
                        editTitleError.innerText = 'Вы ничего не ввели. Зачем хранить воздух?';
                        editTitleError.style.display = 'block';
                    } else {
                        let acceptEditButton = editColumnTitle.parentElement.querySelector('.accept-edit-button'),
                            cancelEditButton = editColumnTitle.parentElement.querySelector('.cancel-edit-button'),
                            newColumnTitle = editColumnTitle.parentElement.querySelector('span');

                        editTitleError.style.display = 'none';
                        editColumnTitle.style.display = 'none';
                        editColumnTitle.classList.remove('active');
                        acceptEditButton.style.display = 'none';
                        cancelEditButton.style.display = 'none';
                        newColumnTitle.innerText = editColumnTitle.value;
                        newColumnTitle.style.display = 'block';
                    }
                });

                let cancelEditButtonImg = document.createElement('img');
                cancelEditButton.className = 'cancel-edit-button';
                cancelEditButton.appendChild(cancelEditButtonImg);
                cancelEditButton.addEventListener('click', function () {
                    let editTitleError = editColumnTitle.parentElement.querySelector('.edit-title-error'),
                        acceptEditButton = editColumnTitle.parentElement.querySelector('.accept-edit-button'),
                        cancelEditButton = editColumnTitle.parentElement.querySelector('.cancel-edit-button'),
                        newColumnTitle = editColumnTitle.parentElement.querySelector('span');
                    editTitleError.style.display = 'none';
                    editColumnTitle.style.display = 'none';
                    editColumnTitle.classList.remove('active');
                    acceptEditButton.style.display = 'none';
                    cancelEditButton.style.display = 'none';
                    newColumnTitle.style.display = 'block';
                    editColumnTitle.value = newColumnTitle.textContent;
                });

                let editTitleError = document.createElement('span'),
                    editTitleErrorText = document.createTextNode('');
                editTitleError.className = 'edit-title-error';
                acceptEditButton.style.display = 'inline-block';
                cancelEditButton.style.display = 'inline-block';
                editTitleError.appendChild(editTitleErrorText);
                columnTitle.target.parentElement.appendChild(editColumnTitle);
                columnTitle.target.parentElement.appendChild(acceptEditButton);
                columnTitle.target.parentElement.appendChild(cancelEditButton);
                columnTitle.target.parentElement.appendChild(editTitleError);
            }
        });

        let columnMover = document.createElement('div'),
            columnMoverDots = document.createElement('div');
        columnMover.className = 'column-mover';
        columnMoverDots.className = 'column-mover-dots';
        columnMover.appendChild(columnMoverDots);
        columnMover.draggable = true;

        columnMover.addEventListener('dragstart', handleDragStartColumn, false);
        columnMover.addEventListener('dragend', handleDragEndColumn, false);

        newCardAdder.className = 'add-card';
        newCardAdder.appendChild(cardAdderText);
        newCardAdder.classList.add('add-card', 'btn', 'btn-small', 'btn-green');

        newCardAdder.addEventListener('click', function () {
            let cardMaker = newCardAdder.parentElement.querySelector('.new-card-maker');
            if (cardMaker) {
                newCardAdder.style.display = 'none';
                cardMaker.style.bottom = '10px';
                cardMaker.parentElement.querySelector('.input-error-message').style.display = 'none';
                cardMaker.style.display = 'block';
                cardMaker.classList.add('active');
                cardMaker.scrollIntoView({behavior: 'smooth'})

            } else {
                newCardAdder.style.display = 'none';
                let newCardMessage = document.createElement('textarea');
                newCardMessage.className = 'new-card-message';
                newCardMessage.maxLength = 4096;
                newCardMessage.addEventListener('input', function () {
                    let newCardMessageVal = newCardMessage.value;
                    newCardMessageVal.trim()
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");
                    if (newCardMessageVal.length === 4096) {
                        inputErrorMessage.innerText = 'Вы ввели максимальное количество символов(4096)';
                        inputErrorMessage.style.display = 'block';
                    } else if (inputErrorMessage.style.display === 'block') {
                        inputErrorMessage.style.display = 'none';
                    }
                });

                let inputErrorMessage = document.createElement('span'),
                    inputErrorMessageText = document.createTextNode(''),
                    newCardMakeButton = document.createElement('span'),
                    newCardMakeButtonText = document.createTextNode('Добавить'),
                    newCardCancelButton = document.createElement('span'),
                    newCardCancelButtonText = document.createTextNode('Отменить');

                inputErrorMessage.className = 'input-error-message';
                inputErrorMessage.appendChild(inputErrorMessageText);
                newCardMakeButton.appendChild(newCardMakeButtonText);
                newCardMakeButton.classList.add('btn', 'btn-small', 'btn-green', 'accept-new-card');
                newCardCancelButton.appendChild(newCardCancelButtonText);
                newCardCancelButton.classList.add('btn', 'btn-small', 'btn-red', 'cancel-new-card');

                newCardCancelButton.addEventListener('click', function () {
                    newCardMaker.style.display = 'none';
                    newCardMaker.classList.remove('active');
                    newCardAdder.style.margin = '10px auto 10px auto';
                    newCardAdder.style.display = 'block';
                    newCardMessage.value = '';
                });

                newCardCancelButton.appendChild(newCardCancelButtonText);
                let newCardMaker = document.createElement('div'),
                    divObj = document.createElement('div');
                newCardMaker.className = 'new-card-maker';
                newCardMaker.style.display = 'block';
                newCardMaker.classList.add('active');
                newCardMaker.style.bottom = '10px';
                divObj.appendChild(newCardMakeButton);
                divObj.appendChild(newCardCancelButton);
                newCardMaker.appendChild(newCardMessage);
                newCardMaker.appendChild(inputErrorMessage);
                newCardMaker.appendChild(divObj);
                column.appendChild(newCardMaker);
                newCardMaker.scrollIntoView({behavior: 'smooth'});
                newCardMakeButton.addEventListener('click', function () {
                    let newCardMessageVal = newCardMessage.value;
                    newCardMessageVal.trim()
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");
                    let fullNewCardMessageText = newCardMessage.value;
                    if (newCardMessageVal.length === 0) {
                        inputErrorMessage.innerText = 'Вы ничего не ввели. Зачем хранить воздух?';
                        inputErrorMessage.style.display = 'block';
                    } else {
                        newCardMaker.style.display = 'none';
                        newCardMaker.classList.remove('active');
                        let newCard = document.createElement('div');
                        let newCardMessageText;
                        if (newCardMessage.value.length >= 300) {
                            newCardMessageText = document.createTextNode(newCardMessage.value.substr(0, 300) + '...');
                        } else {
                            newCardMessageText = document.createTextNode(newCardMessage.value);
                        }
                        let newCardMessageSpan = document.createElement('span');
                        newCardMessageSpan.appendChild(newCardMessageText);
                        newCard.className = "card";
                        newCard.draggable = true;
                        newCard.addEventListener('click', function (elem) {
                            if (!elem.target.classList.contains('make-edit-card')) {
                                newCard.classList.add('opened');
                                modalWindow.style.display = 'block';
                                cover[0].style.display = 'block';
                                modalContent.textContent = fullNewCardMessageText;
                                modalDate.value = newCard.querySelector('.card-date').textContent;
                                if (modalFlag.classList.contains('type1')) modalFlag.classList.remove('type1');
                                if (modalFlag.classList.contains('type2')) modalFlag.classList.remove('type2');
                                if (modalFlag.classList.contains('type3')) modalFlag.classList.remove('type3');
                                let flag = newCard.querySelector('.card-flag');
                                if (flag.classList.contains('type1')) modalFlag.classList.add('type1');
                                if (flag.classList.contains('type2')) modalFlag.classList.add('type2');
                                if (flag.classList.contains('type3')) modalFlag.classList.add('type3');
                            }

                        });

                        newCard.addEventListener('dragstart', handleDragStartCard, false);
                        newCard.addEventListener('dragend', handleDragEndCard, false);
                        let newCardId = generateCardId(),
                            dropPlace = document.createElement('div');
                        newCard.id = newCardId + '-card';
                        dropPlace.className = 'drop-place-card';
                        dropPlace.addEventListener('dragenter', handleDragEnterCard, false);
                        dropPlace.addEventListener('dragleave', handleDragLeaveCard, false);
                        dropPlace.addEventListener('drop', handleDropCard, false);
                        dropPlace.addEventListener('dragover', handleDragOverCard, false);
                        let columnContent = column.querySelector('.column-content'),
                            makeEditCard = document.createElement('div');
                        makeEditCard.className = 'make-edit-card';
                        makeEditCard.style.display = 'inline-block';
                        makeEditCard.addEventListener('click', function (makeEditCard) {
                            makeEditCard.target.style.display = 'none';
                            let card = makeEditCard.target.parentElement,
                                editCardMessage = document.createElement('textarea');
                            card.classList.add('edit');

                            editCardMessage.addEventListener('input', function (newMessageCard) {
                                let newMessageVal = newMessageCard.target.value;
                                newMessageVal.trim()
                                    .replace(/&/g, "&amp;")
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;");
                                let editMessageError = newMessageCard.target.parentElement.parentElement.querySelector('.edit-message-error');
                                if (newMessageVal.length === 4096) {
                                    editMessageError.innerText = 'Вы ввели максимальное количество символов';
                                    editMessageError.style.display = 'block';
                                } else if (editMessageError.style.display === 'block') {
                                    editMessageError.style.display = 'none';
                                }
                            });

                            editCardMessage.classList.add('edit-card-message', 'active');
                            editCardMessage.value = fullNewCardMessageText;
                            editCardMessage.maxLength = "4096";
                            card.style.display = 'none';
                            let cancelEditButton = document.createElement('div'),
                                acceptEditButton = document.createElement('div'),
                                acceptEditButtonImg = document.createElement('img');
                            acceptEditButton.classList.add('accept-edit-button', 'accept-edit-message');
                            acceptEditButton.appendChild(acceptEditButtonImg);
                            acceptEditButton.addEventListener('click', function (acceptEditButton) {
                                let newCardMessage = acceptEditButton.target.parentElement.querySelector('textarea'),
                                    newCardMessageVal = newCardMessage.value;
                                newCardMessageVal.trim()
                                    .replace(/&/g, "&amp;")
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;");
                                let editMessageError = newCardMessage.parentElement.querySelector('.edit-message-error');
                                if (newCardMessageVal.length === 0) {
                                    editMessageError.innerText = 'Вы ничего не ввели. Зачем хранить воздух?';
                                    editMessageError.style.display = 'block';
                                } else {

                                    let newCardMessage = editCardMessage.parentElement.querySelector('.card.edit span');
                                    if (editCardMessage.value.length >= 300) {
                                        newCardMessage.textContent = editCardMessage.value.substr(0, 300) + '...';

                                    } else {
                                        newCardMessage.textContent = editCardMessage.value;
                                    }
                                    fullNewCardMessageText = editCardMessage.value;
                                    card.classList.remove('edit');
                                    newCardMessage.parentElement.style.display = 'block';
                                    makeEditCard.target.style.display = 'inline-block';
                                    editCardMessage.parentElement.querySelector('.accept-edit-button').remove();
                                    editCardMessage.parentElement.querySelector('p').remove();
                                    editCardMessage.parentElement.querySelector('.cancel-edit-button').remove();
                                    editMessageError.remove();
                                    editCardMessage.remove();
                                }
                            });

                            let cancelEditButtonImg = document.createElement('img');
                            cancelEditButton.classList.add('cancel-edit-button', 'cancel-edit-message');
                            cancelEditButton.appendChild(cancelEditButtonImg);
                            cancelEditButton.addEventListener('click', function () {
                                let newCardMessage = editCardMessage.parentElement.querySelector('.card.edit span');
                                newCardMessage.parentElement.style.display = 'block';
                                makeEditCard.target.style.display = 'inline-block';
                                editCardMessage.value = newCardMessage.textContent;
                                card.classList.remove('edit');
                                editCardMessage.parentElement.querySelector('.accept-edit-button').remove();
                                editCardMessage.parentElement.querySelector('p').remove();
                                editCardMessage.parentElement.querySelector('.cancel-edit-button').remove();
                                editMessageError.remove();
                                editCardMessage.remove();
                            });

                            let editMessageError = document.createElement('span'),
                                editMessageErrorText = document.createTextNode(''),
                                p = document.createElement('p');
                            editMessageError.className = 'edit-message-error';
                            acceptEditButton.style.display = 'inline-block';
                            cancelEditButton.style.display = 'inline-block';
                            editMessageError.appendChild(editMessageErrorText);
                            card.parentElement.insertBefore(editCardMessage, card);
                            card.parentElement.insertBefore(editMessageError, card);
                            card.parentElement.insertBefore(p, card);
                            card.parentElement.insertBefore(acceptEditButton, card);
                            card.parentElement.insertBefore(cancelEditButton, card);
                        });

                        let cardData = document.createElement('div'),
                            cardDateText = document.createTextNode(''),
                            cardDate = document.createElement('div'),
                            flag = document.createElement('div');

                        cardData.className = 'card-data';
                        cardDate.className = 'card-date';
                        cardDate.appendChild(cardDateText);
                        flag.classList.add('type1', 'card-flag');
                        cardData.appendChild(flag);
                        cardData.appendChild(cardDate);
                        newCard.appendChild(cardData);
                        newCard.appendChild(makeEditCard);
                        newCard.appendChild(newCardMessageSpan);
                        newCardAdder.style.margin = '0px auto 10px auto';
                        newCardAdder.style.display = 'block';
                        newCardMessage.value = '';
                        columnContent.appendChild(newCard);
                        columnContent.appendChild(dropPlace);
                    }
                })
            }
        });


        columnTitleSpan.appendChild(columnTitleText);
        columnTitle.appendChild(columnTitleSpan);
        columnContent.appendChild(dropPlace);
        column.appendChild(columnMover);
        column.appendChild(columnTitle);
        column.appendChild(sortFlagButton);
        column.appendChild(sortDateButton);
        column.appendChild(columnContent);
        column.appendChild(newCardAdder);

        let dropPlaceColumn = document.createElement('div');
        dropPlaceColumn.className = 'drop-place-column';
        dropPlaceColumn.addEventListener('dragenter', handleDragEnterColumn, false);
        dropPlaceColumn.addEventListener('dragleave', handleDragLeaveColumn, false);
        dropPlaceColumn.addEventListener('drop', handleDropColumn, false);
        dropPlaceColumn.addEventListener('dragover', handleDragOverColumn, false);
        makeColumnButton.parentElement.parentElement.style.display = 'none';

        if (!footerBool) {
            columnAdder.style.display = 'none';
        }
        columns.appendChild(column);
        columns.appendChild(dropPlaceColumn);
        if (!footerBool) {
            columnAdder.style.display = 'inline';
        }
        columnAdder.scrollIntoView({behavior: 'smooth'});
    }

    function handleDragOverTrashcan(trashcan) {
        trashcan.preventDefault();

    }

    function handleDragEnterTrashcan(trashcan) {
    }

    function handleDragLeaveTrashcan(trashcan) {
    }

    function handleDropTrashcan(trashcan) {
        if (trashcan.stopPropagation) {
            trashcan.stopPropagation();
        }
        trashcan.preventDefault();
        trashcan.target.classList.remove('abort-card');
        let trash = trashcan.dataTransfer.getData("Text");
        if (trash.includes('column')) {
            let column = document.getElementById(trash);
            column.classList.remove('is-moving-column');
            column.previousElementSibling.remove();
            column.nextElementSibling.addEventListener('dragover', handleDragOverColumn, false);
            column.nextElementSibling.addEventListener('dragenter', handleDragEnterColumn, false);
            column.remove();
        } else {
            let card = document.getElementById(trash);
            card.classList.remove('is-moving-card');
            card.previousElementSibling.remove();
            card.nextElementSibling.addEventListener('dragover', handleDragOverCard, false);
            card.nextElementSibling.addEventListener('dragenter', handleDragEnterCard, false);
            card.remove();
        }
        return false;
    }

    function handleDragStartCard(card) {
        let dropColumnPlaces = document.querySelectorAll('.drop-place-column');
        dropColumnPlaces.forEach(function (dropColumnPlace) {
            dropColumnPlace.removeEventListener('dragenter', handleDragEnterColumn, false);
            dropColumnPlace.removeEventListener('dragover', handleDragOverColumn, false);
        });

        card.dataTransfer.dropEffect = 'move';
        card.target.classList.add('is-moving-card');
        card.target.nextElementSibling.removeEventListener('dragover', handleDragOverCard, false);
        card.target.nextElementSibling.removeEventListener('dragenter', handleDragEnterCard, false);
        card.target.previousElementSibling.removeEventListener('dragover', handleDragOverCard, false);
        card.target.previousElementSibling.removeEventListener('dragenter', handleDragEnterCard, false);
        card.dataTransfer.setData("Text", card.target.id);
    }

    function handleDragOverCard(dropCardPlace) {
        dropCardPlace.preventDefault();
    }

    function handleDragEnterCard(dropCardPlace) {
        dropCardPlace.target.classList.add('enter-card');
    }

    function handleDragLeaveCard(dropCardPlace) {
        dropCardPlace.target.classList.remove('enter-card');
    }

    function handleDropCard(dropCardPlace) {
        if (dropCardPlace.stopPropagation) {
            dropCardPlace.stopPropagation();
        }
        dropCardPlace.preventDefault();
        dropCardPlace.target.classList.remove('enter-card');
        let cardId = dropCardPlace.dataTransfer.getData("Text"),
            card = document.getElementById(cardId),
            dropPlace = document.createElement('div');

        card.classList.remove('is-moving-card');
        card.previousElementSibling.remove();
        card.nextElementSibling.addEventListener('dragover', handleDragOverCard, false);
        card.nextElementSibling.addEventListener('dragenter', handleDragEnterCard, false);

        dropPlace.className = 'drop-place-card';
        dropPlace.addEventListener('dragenter', handleDragEnterCard, false);
        dropPlace.addEventListener('dragleave', handleDragLeaveCard, false);
        dropPlace.addEventListener('drop', handleDropCard, false);
        dropPlace.addEventListener('dragover', handleDragOverCard, false);
        dropCardPlace.target.parentElement.insertBefore(card, dropCardPlace.target);
        dropCardPlace.target.parentElement.insertBefore(dropPlace, card);
        return false;
    }

    function handleDragEndCard(card) {
        let dropColumnPlaces = document.querySelectorAll('.drop-place-column');
        dropColumnPlaces.forEach(function (dropColumnPlace) {
            dropColumnPlace.addEventListener('dragenter', handleDragEnterColumn, false);
            dropColumnPlace.addEventListener('dragover', handleDragOverColumn, false);
        });
        if (card.target.classList.contains('is-moving-card')) {
            card.target.nextElementSibling.addEventListener('dragover', handleDragOverCard, false);
            card.target.nextElementSibling.addEventListener('dragenter', handleDragEnterCard, false);
            card.target.previousElementSibling.addEventListener('dragover', handleDragOverCard, false);
            card.target.previousElementSibling.addEventListener('dragenter', handleDragEnterCard, false);
            card.target.classList.remove('is-moving-card');
        }

        window.setTimeout(function () {
            if (card.target)
                card.target.classList.add('is-moved-card');
            if (card.target)
                window.setTimeout(function () {
                    card.target.classList.remove('is-moved-card');
                }, 600);
        }, 100);
    }

    function handleDragStartColumn(column) {
        let dropCardPlaces = document.querySelectorAll('.drop-place-card');
        dropCardPlaces.forEach(function (dropCardPlace) {
            dropCardPlace.removeEventListener('dragenter', handleDragEnterCard, false);
            dropCardPlace.removeEventListener('dragover', handleDragOverCard, false);
        });

        column.dataTransfer.dropEffect = 'move';
        if (column.dataTransfer.__proto__.hasOwnProperty('setDragImage'))
            column.dataTransfer.setDragImage(column.target.parentElement, 0, 0);
        column.target.setAttribute('opacity', '100%');
        column.target.parentElement.classList.add('is-moving-column');
        column.target.parentElement.nextElementSibling.removeEventListener('dragover', handleDragOverColumn, false);
        column.target.parentElement.nextElementSibling.removeEventListener('dragenter', handleDragEnterColumn, false);
        column.target.parentElement.previousElementSibling.removeEventListener('dragover', handleDragOverColumn, false);
        column.target.parentElement.previousElementSibling.removeEventListener('dragenter', handleDragEnterColumn, false);
        column.dataTransfer.setData("Text", column.target.parentElement.id); // this / e.target is the source node.
    }

    function handleDragOverColumn(dropColumnPlace) {
        dropColumnPlace.preventDefault();
    }

    function handleDragEnterColumn(dropColumnPlace) {
        dropColumnPlace.target.classList.add('enter-column');
    }

    function handleDragLeaveColumn(dropColumnPlace) {
        dropColumnPlace.target.classList.remove('enter-column');
    }

    function handleDropColumn(dropColumnPlace) {
        if (dropColumnPlace.stopPropagation) {
            dropColumnPlace.stopPropagation();
        }
        dropColumnPlace.preventDefault();
        dropColumnPlace.target.classList.remove('enter-column');
        let columnId = dropColumnPlace.dataTransfer.getData("Text"),
            column = document.getElementById(columnId),
            dropPlace = document.createElement('div');
        column.classList.remove('is-moving-column');
        column.previousElementSibling.remove();
        column.nextElementSibling.addEventListener('dragover', handleDragOverColumn, false);
        column.nextElementSibling.addEventListener('dragenter', handleDragEnterColumn, false);
        dropPlace.className = 'drop-place-column';
        dropPlace.addEventListener('dragenter', handleDragEnterColumn, false);
        dropPlace.addEventListener('dragleave', handleDragLeaveColumn, false);
        dropPlace.addEventListener('drop', handleDropColumn, false);
        dropPlace.addEventListener('dragover', handleDragOverColumn, false);
        dropColumnPlace.target.parentElement.insertBefore(column, dropColumnPlace.target);
        dropColumnPlace.target.parentElement.insertBefore(dropPlace, column);
        return false;
    }

    function handleDragEndColumn(column) {
        let dropCardPlaces = document.querySelectorAll('.drop-place-card');
        dropCardPlaces.forEach(function (dropCardPlace) {
            dropCardPlace.addEventListener('dragenter', handleDragEnterCard, false);
            dropCardPlace.addEventListener('dragover', handleDragOverCard, false);
        });

        if (column.target.parentElement.classList.contains('is-moving-column')) {
            column.target.parentElement.nextElementSibling.addEventListener('dragover', handleDragOverColumn, false);
            column.target.parentElement.nextElementSibling.addEventListener('dragenter', handleDragEnterColumn, false);
            column.target.parentElement.previousElementSibling.addEventListener('dragover', handleDragOverColumn, false);
            column.target.parentElement.previousElementSibling.addEventListener('dragenter', handleDragEnterColumn, false);
            column.target.parentElement.classList.remove('is-moving-column');
        }

        window.setTimeout(function () {
            if (column.target) {
                column.target.classList.add('is-moved-column');
                column.target.parentElement.classList.add('is-moved-column-border');
            }
            if (column.target)
                window.setTimeout(function () {
                    column.target.classList.remove('is-moved-column');
                    column.target.parentElement.classList.remove('is-moved-column-border');
                }, 600);
        }, 100);
    }

    window.onresize = function () {
        const width = document.body.clientWidth;
        if (width < 1200) {
            if (width < 768) {
                if (width < 478) {

                }
            }
        }
    };
    document.addEventListener('click', function (event) {
        let newCardMakers = document.querySelectorAll('.new-card-maker.active');

        if (newCardMakers.length === 1) {
            if (!event.target.classList.contains('add-card') && !newCardMakers[0].contains(event.target)) {
                newCardMakers[0].style.display = 'none';
                newCardMakers[0].classList.remove('active');
                let newCardAdder = newCardMakers[0].parentElement.querySelector('.add-card'),
                    newCardMessage = newCardMakers[0].parentElement.querySelector('.new-card-message');
                newCardAdder.style.margin = '0px auto 10px auto';
                newCardAdder.style.display = 'block';
                newCardMessage.value = '';
            }
        } else if (newCardMakers.length === 2) {
            if (newCardMakers[0].parentElement.id === event.target.parentElement.id) {
                newCardMakers[1].style.display = 'none';
                newCardMakers[1].classList.remove('active');
                let newCardAdder = newCardMakers[1].parentElement.querySelector('.add-card'),
                    newCardMessage = newCardMakers[1].parentElement.querySelector('.new-card-message');
                newCardAdder.style.margin = '0px auto 10px auto';
                newCardAdder.style.display = 'block';
                newCardMessage.value = '';
            } else {
                newCardMakers[0].style.display = 'none';
                newCardMakers[0].classList.remove('active');
                let newCardAdder = newCardMakers[0].parentElement.querySelector('.add-card'),
                    newCardMessage = newCardMakers[0].parentElement.querySelector('.new-card-message');
                newCardAdder.style.margin = '0px auto 10px auto';
                newCardAdder.style.display = 'block';
                newCardMessage.value = '';
            }
        }

        let columnMaker = document.querySelector('#column-maker');
        if (columnMaker && event.target.parentElement && event.target && !(event.target.id === 'column-adder' || event.target.parentElement.id === 'column-adder') && !columnMaker.contains(event.target)) {
            columnMaker.style.display = 'none';
            document.querySelector('#column-adder').style.display = 'block';
        }

        let editColumnTitle = document.querySelector('.edit-column-title');
        if (editColumnTitle && !editColumnTitle.parentElement.contains(event.target)) {
            editColumnTitle.style.display = 'none';
            editColumnTitle.classList.remove('active');
            let acceptEditButton = editColumnTitle.parentElement.querySelector('.accept-edit-button'),
                cancelEditButton = editColumnTitle.parentElement.querySelector('.cancel-edit-button'),
                editTitleError = editColumnTitle.parentElement.querySelector('.edit-title-error'),
                newColumnTitle = editColumnTitle.parentElement.querySelector('span');
            acceptEditButton.style.display = 'none';
            cancelEditButton.style.display = 'none';
            editTitleError.style.display = 'none';
            newColumnTitle.style.display = 'block';
        }

        let editCardMessage = document.querySelectorAll('.edit-card-message');

        if (editCardMessage.length === 1) {
            if (!event.target.classList.contains('make-edit-card') && !event.target.classList.contains('edit-card-message') && !event.target.classList.contains('accept-edit-message') && !event.target.classList.contains('cancel-edit-message')) {
                editCardMessage[0].parentElement.querySelector('.accept-edit-message').remove();
                editCardMessage[0].parentElement.querySelector('.cancel-edit-message').remove();
                let card = editCardMessage[0].parentElement.querySelector('.card.edit ');
                card.classList.remove('edit');
                card.style.display = 'block';
                card.querySelector('.make-edit-card').style.display = 'block';
                editCardMessage[0].remove();
            }
        } else if (editCardMessage.length === 2) {
            if (editCardMessage[0].parentElement.parentElement.id === event.target.parentElement.parentElement.parentElement.id) {
                editCardMessage[1].parentElement.querySelector('.accept-edit-message').remove();
                editCardMessage[1].parentElement.querySelector('.cancel-edit-message').remove();
                let card = editCardMessage[1].parentElement.querySelector('.card.edit ');
                card.classList.remove('edit');
                card.style.display = 'block';
                card.querySelector('.make-edit-card').style.display = 'block';
                editCardMessage[1].remove();
            } else {
                editCardMessage[0].parentElement.querySelector('.accept-edit-message').remove();
                editCardMessage[0].parentElement.querySelector('.cancel-edit-message').remove();
                let card = editCardMessage[0].parentElement.querySelector('.card.edit ');
                card.classList.remove('edit');
                card.style.display = 'block';
                card.querySelector('.make-edit-card').style.display = 'block';
                editCardMessage[0].remove();
            }
        }
        let settingsWindow = document.querySelector('.settings-window');
        if (!event.target.classList.contains('settings') && !settingsWindow.contains(event.target)) {
            settingsWindow.style.display = 'none';
        }


    });

    document.addEventListener('dragstart', function (event) {
        let newCardMakers = document.querySelectorAll('.new-card-maker.active');
        if (newCardMakers.length === 1) {
            if (!event.target.classList.contains('add-card') && !newCardMakers[0].contains(event.target)) {
                newCardMakers[0].style.display = 'none';
                newCardMakers[0].classList.remove('active');
                let newCardAdder = newCardMakers[0].parentElement.querySelector('.add-card'),
                    newCardMessage = newCardMakers[0].parentElement.querySelector('.new-card-message');
                newCardAdder.style.margin = '0px auto 10px auto';
                newCardAdder.style.display = 'block';
                newCardMessage.value = '';
            }
        } else if (newCardMakers.length === 2) {
            if (newCardMakers[0].parentElement.id === event.target.parentElement.id) {
                newCardMakers[1].style.display = 'none';
                newCardMakers[1].classList.remove('active');
                let newCardAdder = newCardMakers[1].parentElement.querySelector('.add-card'),
                    newCardMessage = newCardMakers[1].parentElement.querySelector('.new-card-message');
                newCardAdder.style.margin = '0px auto 10px auto';
                newCardAdder.style.display = 'block';
                newCardMessage.value = '';
            } else {
                newCardMakers[0].style.display = 'none';
                newCardMakers[0].classList.remove('active');
                let newCardAdder = newCardMakers[0].parentElement.querySelector('.add-card'),
                    newCardMessage = newCardMakers[0].parentElement.querySelector('.new-card-message');
                newCardAdder.style.margin = '0px auto 10px auto';
                newCardAdder.style.display = 'block';
                newCardMessage.value = '';
            }
        }

        let columnMaker = document.querySelector('#column-maker');
        if (columnMaker && event.target.parentElement && event.target && !(event.target.id === 'column-adder' || event.target.parentElement.id === 'column-adder') && !columnMaker.contains(event.target)) {
            columnMaker.style.display = 'none';
            document.querySelector('#column-adder').style.display = 'block';
        }

        let editColumnTitle = document.querySelector('.edit-column-title');
        if (editColumnTitle && !editColumnTitle.parentElement.contains(event.target)) {
            editColumnTitle.style.display = 'none';
            editColumnTitle.classList.remove('active');
            let acceptEditButton = editColumnTitle.parentElement.querySelector('.accept-edit-button'),
                cancelEditButton = editColumnTitle.parentElement.querySelector('.cancel-edit-button'),
                editTitleError = editColumnTitle.parentElement.querySelector('.edit-title-error'),
                newColumnTitle = editColumnTitle.parentElement.querySelector('span');
            acceptEditButton.style.display = 'none';
            cancelEditButton.style.display = 'none';
            editTitleError.style.display = 'none';
            newColumnTitle.style.display = 'block';
        }

        let editCardMessage = document.querySelectorAll('.edit-card-message');

        if (editCardMessage.length === 1) {
            if (!event.target.classList.contains('make-edit-card') && !event.target.classList.contains('edit-card-message') && !event.target.classList.contains('accept-edit-message') && !event.target.classList.contains('cancel-edit-message')) {
                editCardMessage[0].parentElement.querySelector('.accept-edit-message').remove();
                editCardMessage[0].parentElement.querySelector('.cancel-edit-message').remove();
                let card = editCardMessage[0].parentElement.querySelector('.card.edit ');
                card.classList.remove('edit');
                card.style.display = 'block';
                card.querySelector('.make-edit-card').style.display = 'block';
                editCardMessage[0].remove();
            }
        } else if (editCardMessage.length === 2) {
            if (editCardMessage[0].parentElement.parentElement.id === event.target.parentElement.parentElement.parentElement.id) {
                editCardMessage[1].parentElement.querySelector('.accept-edit-message').remove();
                editCardMessage[1].parentElement.querySelector('.cancel-edit-message').remove();
                let card = editCardMessage[1].parentElement.querySelector('.card.edit ');
                card.classList.remove('edit');
                card.style.display = 'block';
                card.querySelector('.make-edit-card').style.display = 'block';
                editCardMessage[1].remove();
            } else {
                editCardMessage[0].parentElement.querySelector('.accept-edit-message').remove();
                editCardMessage[0].parentElement.querySelector('.cancel-edit-message').remove();
                let card = editCardMessage[0].parentElement.querySelector('.card.edit ');
                card.classList.remove('edit');
                card.style.display = 'block';
                card.querySelector('.make-edit-card').style.display = 'block';
                editCardMessage[0].remove();
            }
        }
    });

    newColumnTitle.addEventListener('input', function () {
        let columnTitleVal = newColumnTitle.value;
        columnTitleVal.trim()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        if (columnTitleVal.length === 35) {
            inputError.innerText = 'Вы ввели максимальное количество символов';
            inputError.style.display = 'block';
        } else if (inputError.style.display === 'block') {
            inputError.style.display = 'none';
        }
    });

    columnAdder.addEventListener('click', function () {
        inputError.style.display = 'none';
        let columnMaker = document.getElementById('column-maker');
        columnMaker.querySelector('#new-column-title').value = '';
        columnMaker.style.display = 'flex';
        columnMaker.scrollIntoView({behavior: 'smooth'});
        columnAdder.style.display = 'none';
    });

    makeColumnButton.addEventListener('click', function () {
        let columnTitleVal = document.getElementById('new-column-title').value;
        columnTitleVal.trim()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        if (columnTitleVal.length === 0) {
            inputError.innerText = 'Поле не должно быть пустым.';
            inputError.style.display = 'block';
        } else {
            makeNewColumn(columnTitleVal, false);
        }
    });

    cancelColumn.addEventListener('click', function () {
        cancelColumn.parentElement.parentElement.style.display = 'none';
        columnAdder.style.display = 'inline';
    });

    trashcan.addEventListener('dragover', handleDragOverTrashcan, false);

    trashcan.addEventListener('dragenter', handleDragEnterTrashcan, false);

    trashcan.addEventListener('dragleave', handleDragLeaveTrashcan, false);

    trashcan.addEventListener('drop', handleDropTrashcan, false);

    columnAdderFooter.addEventListener('click', function () {
        makeNewColumn('Название');
    });

    columnSearcher.addEventListener('input', function (columnSearcher) {

        let searchRes = document.querySelectorAll('.column-title span'),
            hiddenColumns = document.querySelectorAll('.hidden');
        hiddenColumns.forEach(function (column) {
            column.classList.remove('hidden');
        });
        if (columnSearcher.target.value !== '') {
            searchRes.forEach(function (searchRes) {
                if (searchRes.textContent.indexOf(columnSearcher.target.value) === -1) {
                    searchRes.parentElement.parentElement.classList.add('hidden');
                    searchRes.parentElement.parentElement.previousElementSibling.classList.add('hidden');
                }
            });
        }
    });

    let cancelSearch = columnSearcher.parentElement.querySelector('.cancel-search');

    cancelSearch.addEventListener('click', function () {
        columnSearcher.value = '';
        let hiddenColumns = document.querySelectorAll('.hidden');
        hiddenColumns.forEach(function (column) {
            column.classList.remove('hidden');
        });
    });

    let modalWindow = document.getElementById('modal-window'),
        cover = document.getElementsByClassName('cover'),
        modalContent = modalWindow.querySelector('#modal-content'),
        modalDate = modalWindow.querySelector('.change-date'),
        modalFlag = modalWindow.querySelector('.flag');

    cover[0].addEventListener('click', function (cover) {
        let openedCard = document.querySelector('.opened');
        modalWindow.style.display = 'none';
        cover.target.style.display = 'none';
        openedCard.classList.remove('opened');
    });

    let cancelModalWindow = modalWindow.querySelector('#cancel-modal-window');
    cancelModalWindow.addEventListener('click', function () {
        let openedCard = document.querySelector('.opened');
        modalWindow.style.display = 'none';
        cover[0].style.display = 'none';
        openedCard.classList.remove('opened');
    });

    let modalClose = modalWindow.querySelector('#modal-close');
    modalClose.addEventListener('click', function () {
        let openedCard = document.querySelector('.opened');
        modalWindow.style.display = 'none';
        cover[0].style.display = 'none';
        openedCard.classList.remove('opened');
    });

    let acceptModalWindow = modalWindow.querySelector('#accept-modal-window');

    acceptModalWindow.addEventListener('click', function () {
        let openedCard = document.querySelector('.opened'),
            newDate = modalWindow.querySelector('.change-date').value,
            newFlag = modalWindow.querySelector('.flag'),
            newTypeFlag;
        if (newFlag.classList.contains('type1')) {
            newTypeFlag = 'type1';
        } else if (newFlag.classList.contains('type2')) {
            newTypeFlag = 'type2';
        } else {
            newTypeFlag = 'type3';
        }
        let cardDate = openedCard.querySelector('.card-date');
        cardDate.textContent = newDate;
        let cardFlag = openedCard.querySelector('.card-flag');
        if (cardFlag.classList.contains('type1')) cardFlag.classList.remove('type1');
        if (cardFlag.classList.contains('type2')) cardFlag.classList.remove('type2');
        if (cardFlag.classList.contains('type3')) cardFlag.classList.remove('type3');

        cardFlag.classList.add(newTypeFlag);
        openedCard.classList.remove('opened');
        modalWindow.style.display = 'none';
        cover[0].style.display = 'none';
    });

    let flagChanger = modalWindow.querySelector('.flag');
    flagChanger.addEventListener('click', function (flag) {
        if (flag.target.classList.contains('type1')) {
            flag.target.classList.remove('type1');
            flag.target.classList.add('type2');
        } else if (flag.target.classList.contains('type2')) {
            flag.target.classList.remove('type2');
            flag.target.classList.add('type3');
        } else {
            flag.target.classList.remove('type3');
            flag.target.classList.add('type1');
        }
    });
    let datepicker = new Datepicker('.change-date');

    let link = document.getElementById('style');
    let themeSelector = document.querySelector('#select-theme');
    themeSelector.addEventListener('change', function (ev) {
        let choice = ev.target.selectedIndex;
        if (choice === 0) {
            link.href = './css/pink.css';
        } else if (choice === 1) {
            link.href = './css/dark.css';
        }
    });
    let firstDropPlaceColumn = document.querySelector('.drop-place-column');
    firstDropPlaceColumn.addEventListener('dragenter', handleDragEnterColumn, false);
    firstDropPlaceColumn.addEventListener('dragleave', handleDragLeaveColumn, false);
    firstDropPlaceColumn.addEventListener('drop', handleDropColumn, false);
    firstDropPlaceColumn.addEventListener('dragover', handleDragOverColumn, false);

    let settings = document.querySelector('.settings'),
        settingsWindow = document.querySelector('.settings-window');
    settings.addEventListener('click', function () {
        settingsWindow.style.display = 'inline-block';
    })
};

