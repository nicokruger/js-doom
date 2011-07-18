import random

def get_populations():
	return [str(random.randrange(10) * 10 + 10) for x in range(7)]

for x in range(5):
	for y in range(5):
		x1 = x * 100 + 50
		y1 = y * 100 + 50
		pops = get_populations()
		print "new Zone(new Point(%i,%i), \"a%i%i\", 1.0, [%s])," % (x1,y1,x,y,",".join(pops))
		#print "new Zone(new Point(%i,%i), \"a%i%i\" % (x,y), %s)]," % (x,y,x,y,",".join(get_populations())
