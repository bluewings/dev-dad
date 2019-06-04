import React from 'react';
import JSONTree from 'react-json-tree';
import styles from './JsonTree.module.scss';

function JsonTree(props) {
  return (
    <div className={styles.root}>
      <JSONTree {...props} />
    </div>
  );
}

export default JsonTree;
