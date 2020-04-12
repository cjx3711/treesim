using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NodeSimulation : MonoBehaviour {
    public NodeSimulation root;
    public List<NodeSimulation> links;
    // Start is called before the first frame update
    void Start() {
        links = new List<NodeSimulation>();
    }

    // Update is called once per frame
    void Update() {

    }
}
