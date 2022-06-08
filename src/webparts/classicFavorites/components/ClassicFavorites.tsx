import * as React from 'react';
import styles from './ClassicFavorites.module.scss';
import { IClassicFavoritesProps } from './IClassicFavoritesProps';
import { TextField, ActionButton, Dialog, DialogFooter, PrimaryButton, DefaultButton, DialogType } from 'office-ui-fabric-react';
import { getFollowedDocuments, unFollowDocument } from '../Services/DataRequests';
import { IDocuments } from './IDocuments/IDocuments';

export default function ClassicFavorites(props: IClassicFavoritesProps){

  const [ followedDocs, setFollowedDocs ] = React.useState([]);
  const [searchTxt, setSearchTxt] = React.useState('');
  const [editEnabled, setEditEnabled] = React.useState(false);
  const [hideDialog, setHideDialog] = React.useState(true);
  const [docLinkState, setDocumentLinkState] = React.useState('');

  const editText = editEnabled ? props.okTxt : props.editTxt;

  const updateFollowedDocs = () =>{
    getFollowedDocuments(props.context).then(results => {
      setFollowedDocs(results);
    });
  };

  React.useEffect(()=>{
    updateFollowedDocs();
  }, []);

  const promptUnfollowDialog = (docLink: string) =>{
    setHideDialog(false);
    setDocumentLinkState(docLink);
  };

  const unFollowHandler = () => {
    unFollowDocument(props.context, docLinkState).then(()=>{
      updateFollowedDocs();
      setHideDialog(true);
    });
  };



  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Unfollow Document',
    closeButtonAriaLabel: 'Close',
    subText: 'Are you sure you want to Unfollow this document?',
  };

  return(
    <div className={ styles.classicFavorites }>

      <div className={styles.linksHdrOps}>
        <TextField
          onChange={(_: any, text: string) => setSearchTxt(text)}
          className={styles.linksHdrTxt}
          label={props.wpTitle}
          underlined
          placeholder='Search'
          value={searchTxt}
        />
        <div className={styles.linksHdrBtn}>
          <ActionButton onClick={() => setEditEnabled(prev => !prev)} iconProps={{iconName: editEnabled ? 'CheckMark' : 'Edit'}}>{editText}</ActionButton>
        </div>
      </div>

      <IDocuments 
        documentItems = {followedDocs} 
        unFollowHandler = {promptUnfollowDialog}
        editEnabled = {editEnabled}
        searchTxt = {searchTxt}
      />

      <Dialog
        hidden={hideDialog}
        onDismiss={() => setHideDialog(true)}
        dialogContentProps={dialogContentProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={unFollowHandler} text="Yes" />
          <DefaultButton onClick={() => setHideDialog(true)} text="No" />
        </DialogFooter>
      </Dialog>

    </div>
  );
}

