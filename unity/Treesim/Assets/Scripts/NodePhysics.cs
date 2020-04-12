using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NodePhysics : MonoBehaviour {
    public Vector3 velocity;
    public Vector3 force;
    // Start is called before the first frame update
    void Start() {
        velocity = new Vector3(1, 1, 0);
    }

    // Update is called once per frame
    void Update() {
        // Friction
        force -= velocity * 0.5f;
        // Force affects velocity (a = f/m)
        velocity += force * Time.deltaTime; // / node.size;
        // Move node
        transform.position = transform.position + (velocity * Time.deltaTime);
        // Zero out forces for next frame
        force = Vector3.zero;
    }
}
